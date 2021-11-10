const { db } = require('../util/admin');


// Get the collection of posts
exports.getAllPosts = (req, res) => {
    db.collection('posts')
       .orderBy('createdAt', 'desc')
       .get()
       .then((data) => {
           let posts = [];
           data.forEach((doc) => {
               posts.push({
                   postID: doc.id,
                   body: doc.data().body,
                   username: doc.data().username,
                   createdAt: doc.data().createdAt,
                   commentCount: doc.data().commentCount,
                   likeCount: doc.data().likeCount,
                   userImage: doc.data().userImage
               });
           });
           return res.json(posts);
       })
       .catch((err) => {
           console.error(err);
           res.status(500).json({ error: err.code });
       });
};



// Post a post [to Firebase DB]
    /* NOTE: you could use 

    exports.createPost = functions.https.onRequest((req, res) => { ... }

    but the express method is a nice practice */
exports.createPost = (req, res) => {

    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Body may not be empty' });
    }
    
    // new post object
    const newPost = {
        body: req.body.body,
        username: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    // add the post to the collection [in Firebase DB]
        db.collection('posts')
        .add(newPost)
        .then((doc) => { 
            const resPost = newPost;
            resPost.postID = doc.id;
            res.json(resPost);
        })
        .catch((err) => {
            res.status(500).json({ error: 'Failure to add post' });
            console.error(err);
        });
};


// Get a specific post 
exports.getPost = (req, res) => {
    let postData = {};

    db.doc(`/posts/${req.params.postID}`).get()
        .then((doc) => {

            if (!doc.exists) {
                return res.status(404).json({ error: 'Post not found' });
            }
            postData = doc.data();
            postData.postID = doc.id;
            return db.collection('comments').orderBy('createdAt', 'DESC').where('postID', '==', req.params.postID).get();
        })
        .then((data) => {
            postData.comments = [];
            data.forEach((doc) => {
                postData.comments.push(doc.data());
            });
            return res.json(postData);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};



// Comment on a post
exports.commentOnPost = (req, res) => {

    // ensure comment is not empty
    if (req.body.body.trim() === '')
        return res.status(400).json({ comment: 'Cannot be empty '});

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        postID: req.params.postID,
        username: req.user.handle,
        userImage: req.user.imageUrl
    };
    console.log(newComment);

    db.doc(`/posts/${req.params.postID}`).get()
        .then((doc) => {

            // ensure that the post still exists
            if (!doc.exists) {
                return res.status(404).json({ error: 'Post does not exist' });
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
        })
        .then(() => {
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            res.json(newComment);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Error adding comment' });
        });
};



// Like a post
exports.likePost = (req, res) => {

    // get the number of likes by username and the ID of the post
    const likeDoc = db.collection('likes').where('username', '==', req.user.handle)
        .where('postID', '==', req.params.postID).limit(1);

    const postDoc = db.doc(`/posts/${req.params.postID}`);

    let postData = {};

    postDoc.get()
        .then(doc => {

            if (doc.exists)
            {
                postData = doc.data();
                postData.likeDoc = doc.id;
                return likeDoc.get();
            }
            else
                return res.status(404).json({ error: 'Post not found' });
        })
        .then(data => {

            // if user has not already liked this post...
            if (data.empty) {
                return db.collection('likes')
                    .add({
                        postID: req.params.postID,
                        username: req.user.handle
                      })
                    .then(() => {
                        postData.likeCount++;
                        return postDoc.update({ likeCount: postData.likeCount });
                    })
                    .then(() => {
                        return res.json(postData);
                    })
            }
            else
                return res.status(400).json({ error: 'Post already liked' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};



// Unlike a post
exports.unlikePost = (req, res) => {

    // get the number of likes by username and the ID of the post
    const likeDoc = db.collection('likes').where('username', '==', req.user.handle)
        .where('postID', '==', req.params.postID).limit(1);

    const postDoc = db.doc(`/posts/${req.params.postID}`);

    let postData;
    console.log('IN UNLIKEPOST: ');
    postDoc.get()
        .then((doc) => {

            if (doc.exists)
            {
                postData = doc.data();
                postData.postID = doc.id;
                console.log('postData: ' + postData);
                return likeDoc.get();
            }
            else {
                return res.status(404).json({ error: 'Post not found' });
            }
        })
        .then((data) => {

            // check to see if user has liked this post
            if (data.empty) 
                return res.status(400).json({ error: 'Post already not liked' });
            else
            {
                return db.doc(`/likes/${data.docs[0].id}`).delete()
                    .then(() => {
                        postData.likeCount--;
                        return postDoc.update({ likeCount: postData.likeCount });
                    })
                    .then(() => {
                        res.json(postData);
                    });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};



// Delete a post
exports.deletePost = (req, res) => {

    const document = db.doc(`/posts/${req.params.postID}`);
    document.get()
        .then(doc => {
            
            if (!doc.exists) 
                return res.status(404).json({ error: 'Cannot find the post to delete' });

            if (doc.data().username !== req.user.handle) 
                return res.status(403).json({ error: "You may not delete someone else's post" });
            else    
                return document.delete();
        })
        .then(() => {
            res.json({ message: `Post ${req.params.postID} deleted`});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};