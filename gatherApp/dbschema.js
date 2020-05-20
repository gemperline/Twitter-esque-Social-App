// not accessed by the app, just for DB reference at this point

let db = {
    users: [
        {
            userID: 'QTPluq7gjuYXEWWZAgQLZqUFoL73',
            email: 'ajg@gmail.com',
            handle: 'ajg',
            createdAt: '2020-05-08T18:46:38.886Z',
            bio: 'Hello, my name is Adam',
            website: 'http://www.adamgemperline.com',
            location: 'Somewhere, US'
        }
    ],

    posts: [
        {
            // declare DB attributes
            username: 'User 5',
            body: 'This is the post body',
            createdAt: '2020-05-05T18:38:08.119Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            username: 'ajg',
            postID: '1yg1PeND0wglRRPHMNmF',
            body: 'This is the comment body',
            createdAt: '2020-05-08T18:46:38.886Z'
        }
    ],
    notifications: [
        {
            recipient: 'user',
            sender: 'adam',
            read: 'true | false',
            postID: 'Nb1e1D4qAgq59a1GZJNu',
            type: 'like | comment',
            createdAt: '2020-05-08T18:46:38.886Z'
        }
    ]
};

const userDetails = { 
    // Redux data
    credentials: {
        userID: 'QTPluq7gjuYXEWWZAgQLZqUFoL73',
        email: 'ajg@gmail.com',
        handle: 'ajg',
        createdAt: '2020-05-08T18:46:38.886Z',
        imageUrl: 'image/weoifnwonfw',
        bio: 'Hello, my name is Adam',
        website: 'http://www.adamgemperline.com',
        location: 'Somewhere, US'
    },
    likes: [
        {
            username: 'ajg',
            postID: '1yg1PeND0wglRRPHMNmF'
        },
        {
            username: 'ajg',
            postID: 'Nb1e1D4qAgq59a1GZJNu'
        }
    ]
};