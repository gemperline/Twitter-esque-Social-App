const { admin, db } = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const { validateRegistrationData, validateLoginData, reduceUserDetails } = require('../util/validators');

// Register a new user
exports.register = (req, res) => {

    // create new-user object
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };
    
    const { valid, errors } = validateRegistrationData(newUser);

    if (!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png';

    let token, userID;

    db.doc(`/users/${newUser.handle}`)
        .get()
        .then(doc => {
            if (doc.exists)     // if user's handle already exists...
            {   
                return res.status(400).json({ handle: 'Username is already in use' });
            }
            else                // create a new user
            {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then(data => {
            // get user's unique token
            userID = data.user.uid;
            return data.user.getIdToken();
        })
        .then(tokn => {
            // store the user's token
            token = tokn;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                userID
            };
            // persist these credentials into the "users" collection in DB
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token })
        })
        .catch(err => {
            console.error(err);
            if (err.code == 'auth/email-already-in-use')
            {
                return res.status(400).json({ email: 'An account with that email already exists' });
            }
            else
            {
                return res.status(500).json({ general: 'Registration err, please try again' });
            }
        });
};


// Login
exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const { valid, errors } = validateLoginData(user);

    if (!valid) return res.status(400).json(errors);
    
    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({ token });
        })
        .catch(err => {
            console.error(err);
        
            if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-email')
                return res.status(403).json({ general: 'Incorrect email or password'});
            else 
                return res.status(500).json({ general : err.code });
        });
};



// Add user details
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({ message: 'Details added successfully '});
        })
        .catch(err => {
              console.error(err);
                return res.status(500).json({ error: err.code });
        })
};



// Get any user's details
exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.handle}`).get()
        .then(doc => {

            if (doc.exists) 
            {
                userData.user = doc.data();
                return db.collection('posts').where('username', '==', req.params.handle)
                    .orderBy('createdAt', 'DESC')
                    .get();
            }
            else
                return res.status(404).json({ error: 'User not found' });
        })
        .then(data => {
            userData.posts = [];
            data.forEach(doc => {
                userData.posts.push({
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    username: doc.data().username,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    postID: doc.id,
                })
            });
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
};



// Get own user details
exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get()
        .then(doc => {
            
            // always check doc existence in Firebase to prevent crashes
            if (doc.exists)
            {
                // fetch user's data and store in object named 'credentials'
                userData.credentials = doc.data();
                // return their likes
                return db.collection('likes').where('username', '==', req.user.handle).get();
            }
            else
                {
                    console.log('Error accessing document');
                    return res.status(404).json('Error accessing document');
                }
        })
        .then(data => {
            userData.likes = [];

            data.forEach(doc => {
                userData.likes.push(doc.data());
            });
            return db.collection('notifications').where('recipient', '==', req.user.handle)
                .orderBy('createdAt', 'DESC').limit(10).get();
        })
        .then(data => {
            userData.notifications = [];
            data.forEach(doc => {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    createdAt: doc.data().createdAt,
                    postID: doc.data().postID,
                    type: doc.data().type,
                    read: doc.data().read,
                    notificationID: doc.id
                })
            })
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            //return res.status(500).json({ error: err.code });
        })
};


// User image upload
exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers: req.headers });

    let imageFileName;    
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => { 

        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png')
            return res.status(400).json({ error: 'File type must be .jpeg or .png' });

        const imageExtension = filename.split('.')[filename.split('.').length - 1];   // store the image ext (i.e. '.png')
        imageFileName = `${Math.round(Math.random() * 100000000000)}.${imageExtension}`;  // random numerical filename (ex. '656724628.png') as a string  
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));

        const IFN = imageFileName;    // store imageFileName here, otherwise imageFileName will be out of scope when used in imageUrl string (due its imageExtension component)
    });
    busboy.on('finish', () => { 

        console.log('IFN: ' + IFN);
        admin
            .storage()
            .bucket(config.storageBucket)
            .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
                return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
            })
            .then(() => {
                return res.json({ message: 'Image ' + imageFileName + ' uploaded successfully'});
            })
            .catch(err => {
                console.error("Upload image error");
                return res.status(500).json({ error: err.code });
            });
        });
    busboy.end(req.rawBody);
};



exports.markNotificationsAsRead = (req, res) => {
    let batch = db.batch();

    req.body.forEach(notificationID => {
        const notification = db.doc(`/notifications/${notificationID}`);
        batch.update(notification, { read: true });
    });
    batch.commit()
        .then(() => {
            return res.json({ message: 'Notifications marked as read' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};