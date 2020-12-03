const { db } = require('../util/admin')

const firebaseConfig = require('../util/config/firebaseConfig')
const firebase = require('firebase')
firebase.initializeApp(firebaseConfig)

//validation
const { validateSignupData, validateLoginData } = require('../util/validations/validators')


exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    }


    const { valid, errors } = validateSignupData(newUser)
    if(!valid) return res.status(400).json(errors)


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
}

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }


    const { valid, errors } = validateLoginData(user)
    if(!valid) return res.status(400).json(errors)


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
}