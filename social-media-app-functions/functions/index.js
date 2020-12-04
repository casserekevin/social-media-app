const functions = require('firebase-functions');
const app = require('express')()

//Middleware
const firebaseAuthenticationMiddleware = require('./util/middleware/firebaseAuthenticationMiddleware')

//Handlers
const { getAllScreams, getOneScream, postOneScream, postOneComment } = require('./handlers/screams')
const { signup, login, getUserDetails, addUserDetails, uploadImage } = require('./handlers/users')

//Routes
//Screams routes
app.get('/screams', getAllScreams)
app.get('/scream/:screamId', getOneScream)
app.post('/scream', firebaseAuthenticationMiddleware, postOneScream)
app.post('/scream/:screamId/comment', firebaseAuthenticationMiddleware, postOneComment)

//Users routes
app.post('/signup', signup)
app.post('/login', login)
app.get('/user', firebaseAuthenticationMiddleware, getUserDetails)
app.post('/user', firebaseAuthenticationMiddleware, addUserDetails)
app.post('/user/image', firebaseAuthenticationMiddleware, uploadImage) 

//https://baseurl.com/api/
exports.api = functions.region('southamerica-east1').https.onRequest(app)
