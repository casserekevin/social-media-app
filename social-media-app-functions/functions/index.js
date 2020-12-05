const functions = require('firebase-functions');
const app = require('express')()

const { db } = require('./util/admin')

//Middleware
const firebaseAuthenticationMiddleware = require('./util/middleware/firebaseAuthenticationMiddleware')

//Handlers
const { getAllScreams, getOneScream, postOneScream, deleteOneScream, likeOneScream, unlikeOneScream, postOneComment } = require('./handlers/screams')
const { signup, login, getPublicUserDetails, getAuthenticatedUserDetails, addUserDetails, uploadImage, markNotificationsAsRead } = require('./handlers/users')

//Routes
//Screams routes
app.get('/screams', getAllScreams)
app.get('/scream/:screamId', getOneScream)
app.post('/scream', firebaseAuthenticationMiddleware, postOneScream)
app.delete('/scream/:screamId', firebaseAuthenticationMiddleware, deleteOneScream)
app.get('/scream/:screamId/like', firebaseAuthenticationMiddleware, likeOneScream)
app.get('/scream/:screamId/unlike', firebaseAuthenticationMiddleware, unlikeOneScream)
app.post('/scream/:screamId/comment', firebaseAuthenticationMiddleware, postOneComment)

//Users routes
app.post('/signup', signup)
app.post('/login', login)
app.get('/user/:handle', getPublicUserDetails)
app.get('/user', firebaseAuthenticationMiddleware, getAuthenticatedUserDetails)
app.post('/user', firebaseAuthenticationMiddleware, addUserDetails)
app.post('/user/image', firebaseAuthenticationMiddleware, uploadImage) 

app.post('/notifications', firebaseAuthenticationMiddleware, markNotificationsAsRead) 

//https://baseurl.com/api/
exports.api = functions.region('southamerica-east1').https.onRequest(app)

//TRIGGERS
//create notifications:like
exports.createNotificationsOnLike = functions.region('southamerica-east1').firestore.document('likes/{id}').onCreate((snapshot) => {
    return db.doc(`screams/${snapshot.data().screamId}`).get()
    .then((doc) => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
            return db.doc(`notifications/${snapshot.id}`).set({
                recipient: doc.data().userHandle,
                sender: snapshot.data().userHandle,
                read: false,
                type: 'like',
                screamId: doc.id,
                createdAt: new Date().toISOString()
            })
        }
    })
    .catch((error) => {
        console.error(error);
    })
})

//delete notifications:unlike
exports.deleteNotificationsOnUnlike = functions.region('southamerica-east1').firestore.document('likes/{id}').onDelete((snapshot) => {
    return db.doc(`notifications/${snapshot.id}`).delete()
    .catch((error) => {
        console.error(error);
    })
})

//create notifications:comment
exports.createNotificationsOnComment = functions.region('southamerica-east1').firestore.document('comments/{id}').onCreate((snapshot) => {
    return db.doc(`screams/${snapshot.data().screamId}`).get()
    .then((doc) => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
            return db.doc(`notifications/${snapshot.id}`).set({
                recipient: doc.data().userHandle,
                sender: snapshot.data().userHandle,
                read: false,
                type: 'comment',
                screamId: doc.id,
                createdAt: new Date().toISOString()
            })
        }
    })
    .catch((error) => {
        console.error(error);
    })
})

exports.updateScreamsImageOnUserImageUpdate = functions.region('southamerica-east1').firestore.document('users/{id}').onUpdate((snapshot) => {
    
    if(snapshot.before.data().imageUrl !== snapshot.after.data().imageUrl){
        const batch = db.batch()
        return db.collection('screams').where('userHandle', '==', snapshot.before.data().handle).get()
        .then((data) => {
            data.forEach((doc) => {
                const scream = db.doc(`/screams/${doc.id}`)
                batch.update(scream, { userImage: snapshot.after.data().imageUrl })
            })
    
            return batch.commit()
        })
    }
    else {
        return true
    }
})

exports.deleteCommentsAndLikesAndNotificationsOnScreamDelete = functions.region('southamerica-east1').firestore.document('screams/{id}').onDelete((snapshot, context) => {
    const screamId = context.params.id

    const batch = db.batch()

    return db.collection('comments').where('screamId', '==', screamId).get()
    .then((data) => {
        data.forEach((doc) => {
            batch.delete(db.doc(`/comments/${doc.id}`))
        })
        return db.collection('likes').where('screamId', '==', screamId).get()
    })
    .then((data) => {
        data.forEach((doc) => {
            batch.delete(db.doc(`/likes/${doc.id}`))
        })
        return db.collection('notifications').where('screamId', '==', screamId).get()
    })
    .then((data) => {
        data.forEach((doc) => {
            batch.delete(db.doc(`/notifications/${doc.id}`))
        })
        return batch.commit()
    })
    .catch((error) => {
        console.error(error);
    })

})