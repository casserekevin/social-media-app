let db = {
    users: [
        {
            userId: '08BnlZQ5erTaSjdcbooyMogpTrC3',
            email: 'user@email.com',
            handle: 'user',
            createdAt: '2020-12-02T18:34:47.993Z',
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/social-media-app-kvc00.appspot.com/o/863991989400.jpg?alt=media',
            bio: 'Hello, my name is user, this is my bio',
            website: 'https://user.com',
            location: 'London, UK'
        }
    ],
    screams: [
        {
            userHandle: 'user',
            body: 'this is a scream body',
            createdAt: '2020-12-02T18:34:47.993Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle: 'user',
            screamId: '2SQsy1WSu60CnqbgIBwR',
            body: 'Hey mate, how are you?',
            createdAt: '2020-12-02T18:34:47.993Z',
        }
    ],
    notifications: [
        {
            recipient: 'user',
            sender: 'john',
            read: 'true | false',
            screamId: 'glYIorxZ1U4kDZckCUsZ',
            type: 'like | comment',
            createdAt: '2020-12-04T18:34:47.993Z'
        }
    ]
}

const userDetails = {
    // redux data
    credentials: {
        userId: '08BnlZQ5erTaSjdcbooyMogpTrC3',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2020-12-02T18:34:47.993Z',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/social-media-app-kvc00.appspot.com/o/863991989400.jpg?alt=media',
        bio: 'Hello, my name is user, this is my bio',
        website: 'https://user.com',
        location: 'London, UK'
    },
    likes: [
        {
            userHandle: 'user',
            screamId: '2SQsy1WSu60CnqbgIBwR',
        },
        {
            userHandle: 'user',
            screamId: '41boV3fmVVMON51iXvpC',
        },
    ]
}
