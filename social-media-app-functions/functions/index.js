const functions = require('firebase-functions');
const app = require('express')()

const { db } = require('./util/admin')

//Middleware
const firebaseAuthenticationMiddleware = require('./util/middleware/firebaseAuthenticationMiddleware')

//Handlers
const { getAllScreams, getOneScream, postOneScream, deleteOneScream, likeOneScream, unlikeOneScream, postOneComment } = require('./handlers/screams')
const { signup, login, getUserDetails, addUserDetails, uploadImage } = require('./handlers/users')

//Routes
//Screams routes
app.get('/screams', getAllScreams)
app.get('/scream/:screamId', getOneScream)
app.post('/scream', firebaseAuthenticationMiddleware, postOneScream)
app.delete('/scream/:screamId', firebaseAuthenticationMiddleware, deleteOneScream)
//others routes
app.get('/scream/:screamId/like', firebaseAuthenticationMiddleware, likeOneScream)
app.get('/scream/:screamId/unlike', firebaseAuthenticationMiddleware, unlikeOneScream)
app.post('/scream/:screamId/comment', firebaseAuthenticationMiddleware, postOneComment)

//Users routes
app.post('/signup', signup)
app.post('/login', login)
app.get('/user', firebaseAuthenticationMiddleware, getUserDetails)
app.post('/user', firebaseAuthenticationMiddleware, addUserDetails)
app.post('/user/image', firebaseAuthenticationMiddleware, uploadImage) 

//https://baseurl.com/api/
exports.api = functions.region('southamerica-east1').https.onRequest(app)

//create notifications:like
exports.createNotificationsOnLike = functions.region('southamerica-east1').firestore.document('likes/{id}')
.onCreate((snapshot) => {
    db.doc(`screams/${snapshot.data().screamId}`).get()
    .then((doc) => {
        if(doc.exists){
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
    .then(() => {
        return
    })
    .catch((error) => {
        console.error(error);
        return
    })
})

//delete notifications:unlike
exports.deleteNotificationsOnUnlike = functions.region('southamerica-east1').firestore.document('likes/{id}')
.onDelete((snapshot) => {
    db.doc(`notifications/${snapshot.id}`).delete()
    .then(() => {
        return
    })
    .catch((error) => {
        console.error(error);
        return
    })
})

//create notifications:comment
exports.createNotificationsOnComment = functions.region('southamerica-east1').firestore.document('comments/{id}')
.onCreate((snapshot) => {
    db.doc(`screams/${snapshot.data().screamId}`).get()
    .then((doc) => {
        if(doc.exists){
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
    .then(() => {
        return
    })
    .catch((error) => {
        console.error(error);
        return
    })
})
