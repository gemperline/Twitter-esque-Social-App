/*
*   This React.js social media application serves as a learing foundation.
*   Common features include user posts that are displayed in a live feed, user accounts along with basic 
*   account settings and features, and a fun, interactive user interface. 
*
*   This application also serves as a segway that another social app will branch off of
*/

//~~~~~~~~~~ DO NOT PUBLISH admin.json in public repository ~~~~~~~~~~
// see admin.js and admin.json
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const functions = require('firebase-functions');

const app = require('express')(); // express makes 'app' work like a stored procedure

const { db } = require('./util/admin');

// Authorization
const FBAuth = require('./util/fbAuth');

// Declarations with Imports
const { 
    getAllPosts, 
    createPost,
    getPost,
    commentOnPost,
    likePost,
    unlikePost,
    deletePost
} = require('./handlers/posts');
const { 
    register, 
    login, 
    uploadImage, 
    addUserDetails, 
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsAsRead
} = require('./handlers/users');

// Send/Get 'post' [to Firebase DB] routes => posts.js
app.get('/posts', getAllPosts);
app.post('/post', FBAuth, createPost);
app.get('/post/:postID', getPost);
app.post('/post/:postID/comment', FBAuth, commentOnPost);
app.get('/post/:postID/like', FBAuth, likePost);
app.get('/post/:postID/unlike', FBAuth, unlikePost);
app.delete('/post/:postID', FBAuth, deletePost);

// User ability routes => users.js
app.post('/register', register);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);   // user profile image
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser); // get a user's ID
app.get('/user/:handle', getUserDetails);
app.post('/notifications', markNotificationsAsRead);

exports.api = functions.https.onRequest(app);



exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/posts/${snapshot.data().postID}`).get()
            .then(doc => {

                // if the post exists and the it is not the user's own post, create notification
                if (doc.exists && doc.data().username !== snapshot.data().username)
                {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().username,
                        sender: snapshot.data().username,
                        type: 'like',
                        read: false,
                        postID: doc.id
                    });
                }      
            })
            .catch(err => {
                console.error(err);
            });
    });



exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
.onDelete((snapshot) => {
    return db.doc(`/notifications/${snapshot.id}`)
        .delete()
        .catch(err => {
            console.error(err);
            return;
        });
});



exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
.onCreate((snapshot) => {
    return db.doc(`/posts/${snapshot.data().postID}`).get()
        .then(doc => {

            // if the post exists and the it is not the user's own post, create notification
            if (doc.exists && doc.data().username !== snapshot.data().username)
            {
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().username,
                    sender: snapshot.data().username,
                    type: 'comment',
                    read: false,
                    postID: doc.id
                });
            }      
        })
        .catch(err => {
            console.error(err);
            return;
        });
});



exports.onUserImageChange = functions.firestore.document('/users/{userID}')
    .onUpdate((change) => {

        console.log(change.before.data());
        console.log(change.after.data());

        // if the 
        if (change.before.data().imageUrl !== change.after.data().imageUrl)
        {
            console.log('Image has changed');
            const batch = db.batch();
            return db.collection('posts').where('username', '==', change.before.data().handle).get()
                .then(data => {
                    data.forEach(doc => {

                        // store the post
                        const post = db.doc(`/posts/${doc.id}`);
                        // update the post's imageUrl
                        batch.update(post, { userImage: change.after.data().imageUrl });
                    })
                    return batch.commit();
                })
        }
        else 
            return true;
    });



    exports.onPostDelete = functions.firestore.document('/posts/{postID}')
        .onDelete((snapshot, context) => { 
            const postID = context.params.postID;
            const batch = db.batch();

            // get the posts's comments
            return db.collection('comments').where('postID', '==', postID).get()
                .then(data => {
                    data.forEach(doc => {
                        // delete associated comments
                        batch.delete(db.doc(`/comments/${doc.id}`));
                    })
                    return db.collection('likes').where('postID', '==', postID).get();
                })
                .then(data => {
                    data.forEach(doc => {
                        //delete associated likes
                        batch.delete(db.doc(`/likes/${doc.id}`));
                    })
                    return db.collection('notifications').where('postID', '==', postID).get();
                })
                .then(data => {
                    data.forEach(doc => {
                        // delete associated notifications
                        batch.delete(db.doc(`/notifications/${doc.id}`));
                    })
                    return batch.commit();
                })
                .catch(err => console.error(err));
        });