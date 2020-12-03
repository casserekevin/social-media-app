const functions = require('firebase-functions');
const admin = require('firebase-admin')
const app = require('express')()

admin.initializeApp()

const firebaseConfig = {
    apiKey: "AIzaSyBJOnlB_zjHsbSbfkruK4vdIvMSWj4sHf0",
    authDomain: "social-media-app-kvc00.firebaseapp.com",
    databaseURL: "https://social-media-app-kvc00.firebaseio.com",
    projectId: "social-media-app-kvc00",
    storageBucket: "social-media-app-kvc00.appspot.com",
    messagingSenderId: "581759819928",
    appId: "1:581759819928:web:a9fe7366d8fe6bd7a2b0ed",
    measurementId: "G-DQHLQ5F4KQ"
};
const firebase = require('firebase')
firebase.initializeApp(firebaseConfig)


const db = admin.firestore()

app.get('/screams', (req, res) => {
    db.collection('screams').orderBy('createdAt', 'desc').get()
    .then((data) => {
        let screams = []
        data.forEach((doc) => {
            screams.push({
                screamId: doc.id,
                ...doc.data()
            })
        })
        return res.json(screams)
    })
    .catch((error) => {
        console.error(error)
    })
})

app.post('/scream', (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    }

    db.collection('screams').add(newScream)
    .then((data) => {
        res.json({ message: `document ${data.id} created successfully` })
    })
    .catch((error) => {
        res.status(500).json({ error: 'Something went wrong' })
        console.error(error)
    })
})

// TODO: Change validation's local
// Validations
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) {
        return true;
    }
    return false;
  };
  
const isEmpty = (string) => {
    if (string.trim() === '') {
        return true;
    }
    return false;
};

//Signup route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    }


    // TODO: validate data
    let errors = {}
    //email
    if(isEmpty(newUser.email)) errors.email = 'Must not be empty'
    else if(!isEmail(newUser.email)) errors.email = 'Must be a valid email address'
    
    //password
    if(isEmpty(newUser.password)) errors.password = 'Must not be empty'

    //confirmPassword
    if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'passwords must be equal'
    
    //handle
    if(isEmpty(newUser.handle)) errors.handle = 'Must not be empty'

    //possui algum erro?
    if(Object.keys(errors).length > 0) return res.status(400).json(errors)


    let token, userId
    db.doc(`/users/${newUser.handle}`).get()
    .then((doc) => {
        if(doc.exists){
            return res.status(400).json({ handle: 'this handle is already taken'})
        }
        else{
            //cria credencial
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        }
    })
    .then((data) => {
        userId = data.user.uid
        return data.user.getIdToken()
    })
    .then((idToken) => {
        //cria usuario no banco
        token = idToken
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId
        }
        return db.doc(`/users/${newUser.handle}`).set(userCredentials)
    })
    .then(() => {
        return res.status(201).json({ token })
    })
    .catch((error) => {
        console.error(error)
        if(error.code === 'auth/email-already-in-use'){
            return res.status(400).json({ email: 'this email is already taken' })
        }
        else{
            return res.status(500).json({ error: error.code })
        }
    })
})

app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }


    // TODO: validate data
    let errors = {}
    //email
    if(isEmpty(user.email)) errors.email = 'Must not be empty'
    else if(!isEmail(user.email)) errors.email = 'Must be a valid email address'
    
    //password
    if(isEmpty(user.password)) errors.password = 'Must not be empty'

    //possui algum erro?
    if(Object.keys(errors).length > 0) return res.status(400).json(errors)


    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
        return data.user.getIdToken()
    })
    .then((token) => {
        return res.json({ token })
    })
    .catch((error) => {
        console.error(error)
        if(error.code === 'auth/user-not-found'){
            return res.status(403).json({ general: 'Invalid email, please try again' })
        }
        else if(error.code === 'auth/wrong-password'){
            return res.status(403).json({ general: 'Invalid password, please try again' })
        }
        else{
            return res.status(500).json({ error: error.code })
        }
    })
})


//https://baseurl.com/api/
exports.api = functions.region('southamerica-east1').https.onRequest(app)
