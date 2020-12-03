const { admin, db } = require('../util/admin')

const firebaseConfig = require('../util/config/firebaseConfig')
const firebase = require('firebase')
firebase.initializeApp(firebaseConfig)

//validation
const { validateSignupData, validateLoginData } = require('../util/validations/validators')
const { log } = require('console')


exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    }


    const { valid, errors } = validateSignupData(newUser)
    if(!valid) return res.status(400).json(errors)


    const standardImg = 'no-img.png'

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
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${standardImg}?alt=media`,
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

exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy')
    const path = require('path')
    const os = require('os')
    const fs = require('fs')

    const busboy = new BusBoy({ headers: req.headers })

    let imageFileName
    let imageToBeUploaded = {}
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            return res.status(400).json({ error: "Wrong file type submitted" });
        }

        // image.png
        const imageNameSplited = filename.split('.')
        const imageExtension = imageNameSplited[imageNameSplited.length - 1]

        //234532564489.png
        imageFileName = `${Math.round(Math.random() * 1000000000000).toString()}.${imageExtension}`
        console.log(imageFileName);

        const filepath = path.join(os.tmpdir(), imageFileName)

        imageToBeUploaded = { filepath, mimetype }

        file.pipe(fs.createWriteStream(filepath))
    })
    busboy.on('finish', () => {
        admin.storage().bucket(firebaseConfig.storageBucket).upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`
            return db.doc(`/users/${req.user.handle}`).update({ imageUrl })
        })
        .then(() => {
            return res.json({ message: 'Image uploaded successfuly'})
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: error.code })
        })
    })
    busboy.end(req.rawBody)
}