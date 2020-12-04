const { db } = require('../util/admin')

//validation
const { validatePostOneScreamData, validatePostOneCommentData } = require('../util/validations/validators')

exports.getAllScreams = (req, res) => {
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
        res.status(500).json({ error: error.code })
    })
}

exports.getOneScream = (req, res) => {
    let screamData = {}

    db.doc(`/screams/${req.params.screamId}`).get()
    .then((doc) => {
        if(!doc.exists){
            return res.status(404).json({ error: 'Scream not found' })
        }
        screamData = doc.data()
        screamData.screamId = doc.id
        return db.collection('comments').orderBy('createdAt', 'desc').where('screamId', '==', req.params.screamId).get()
    })
    .then((data) => {
        screamData.comments = []

        data.forEach((doc) => {
            screamData.comments.push(doc.data())
        })
        return res.json(screamData)
    })
    .catch((error) => {
        console.error(error);
        return res.status(500).json({ error: error.code })
    })
}



exports.postOneScream = (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString(),
    }


    const { valid, errors } = validatePostOneScreamData(newScream)
    if(!valid) return res.status(400).json(errors)


    db.collection('screams').add(newScream)
    .then((data) => {
        res.json({ message: `scream ${data.id} created successfully` })
    })
    .catch((error) => {
        console.error(error)
        res.status(500).json({ error: error.code })
    })
}

exports.postOneComment = (req, res) => {
    const newComment = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString(),
        screamId: req.params.screamId,
        userImage: req.user.imageUrl
    }

    const { valid, errors } = validatePostOneCommentData(newComment)
    if(!valid) return res.status(400).json(errors)

    db.doc(`/screams/${req.params.screamId}`).get()
    .then((doc) => {
        if(!doc.exists){
            return res.status(404).json({ error: 'Scream not found' })
        }

        return db.collection('comments').add(newComment)
    })
    .then((data) => {
        res.json(newComment)
    })
    .catch((error) => {
        console.error(error)
        res.status(500).json({ error: error.code })
    })

}