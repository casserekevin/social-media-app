const { db } = require('../util/admin')

//validation
const { validatePostOneScreamData, validatePostOneCommentData } = require('../util/validations/validators')

exports.getAllScreams = (req, res) => {
    db.collection('screams').orderBy('createdAt', 'desc').get()
    .then((data) => {
        let screams = []
        data.forEach((doc) => {
            screams.push({
                ...doc.data(),
                screamId: doc.id,
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
        userImage: req.user.imageUrl,
        likeCount: 0,
        commentCount: 0
    }


    const { valid, errors } = validatePostOneScreamData(newScream)
    if(!valid) return res.status(400).json(errors)


    db.collection('screams').add(newScream)
    .then((data) => {
        newScream.screamId = data.id

        res.json(newScream)
    })
    .catch((error) => {
        console.error(error)
        res.status(500).json({ error: error.code })
    })
}

exports.deleteOneScream = (req, res) => {
    const document = db.doc(`/screams/${req.params.screamId}`)

    document.get()
    .then((doc) => {
        if(!doc.exists){
            return res.status(404).json({ error: 'Scream not found' })
        }

        if(doc.data().userHandle !== req.user.handle){
            return res.status(403).json({ error: 'Unauthorized' })
        }

        return document.delete()
    })
    .then(() => {
        res.json({ message: 'Scream deleted successfully'})
    })
    .catch((error) => {
        console.error(error)
        res.status(500).json({ error: error.code })
    })
}


exports.likeOneScream = (req, res) => {
    //create query to like document
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId).limit(1)

    //create query to scream document
    const screamDocument = db.doc(`/screams/${req.params.screamId}`)


    // first check if scream document exists
    let screamData
    screamDocument.get()
    .then((doc) => {
        // if doesn't exists scream document
        if(!doc.exists){
            return res.status(404).json({ error: 'Scream not found' })
        }

        //if exists scream document call query of like document
        screamData = doc.data()
        screamData.screamId = doc.id
        return likeDocument.get()
    })
    .then((data) => {
        //if like document exists -> scream already liked
        if(!data.empty){
            return res.status(400).json({ error: 'Scream already liked'})
        }
        
        //scream not liked yet -> add the like document
        return db.collection('likes').add({
            screamId: req.params.screamId,
            userHandle: req.user.handle
        })
        .then(() => {
            screamData.likeCount++
            return screamDocument.update({ likeCount: screamData.likeCount })
        })
        .then(() => {
            return res.json(screamData)
        })
    })
    .catch((error) => {
        console.error(error);
        
        return res.status(500).json({ error: error.code })
    })
}

exports.unlikeOneScream = (req, res) => {
    //create query to like document
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId).limit(1)

    //create query to scream document
    const screamDocument = db.doc(`/screams/${req.params.screamId}`)


    // first check if scream document exists
    let screamData
    screamDocument.get()
    .then((doc) => {
        // if doesn't exists scream document
        if(!doc.exists){
            return res.status(404).json({ error: 'Scream not found' })
        }

        //if exists scream document call query of like document
        screamData = doc.data()
        screamData.screamId = doc.id
        return likeDocument.get()
    })
    .then((data) => {
        //if like document doesn't exists -> scream not liked
        if(data.empty){
            return res.status(400).json({ error: 'Scream not liked'})
        }
        
        //scream liked -> remove the like document
        return db.doc(`/likes/${data.docs[0].id}`).delete()
        .then(() => {
            screamData.likeCount--
            return screamDocument.update({ likeCount: screamData.likeCount })
        })
        .then(() => {
            return res.json(screamData)
        })
    })
    .catch((error) => {
        console.error(error);
        
        return res.status(500).json({ error: error.code })
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

        return doc.ref.update({ commentCount: doc.data().commentCount + 1})
    })
    .then(() => {
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