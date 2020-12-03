const functions = require('firebase-functions');

const app = require('express')()

//Middleware
const firebaseAuthenticationMiddleware = require('./util/middleware/firebaseAuthenticationMiddleware')

//Handlers
const { getAllScreams, postOneScream } = require('./handlers/screams')
const { signup, login } = require('./handlers/users')

//Routes
//Screams routes
app.get('/screams', getAllScreams)
app.post('/scream', firebaseAuthenticationMiddleware, postOneScream)

//Users routes
app.post('/signup', signup)
app.post('/login', login)

//https://baseurl.com/api/
exports.api = functions.region('southamerica-east1').https.onRequest(app)
