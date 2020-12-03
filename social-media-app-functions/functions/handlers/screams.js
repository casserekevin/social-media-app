const { db } = require('../util/admin')

//validation
const { validatePostOneScreamData } = require('../util/validations/validators')

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

exports.postOneScream = (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString()
    }


    const { valid, errors } = validatePostOneScreamData(newScream)
    if(!valid) return res.status(400).json(errors)


    db.collection('screams').add(newScream)
    .then((data) => {
        res.json({ message: `document ${data.id} created successfully` })
    })
    .catch((error) => {
        res.status(500).json({ error: 'Something went wrong' })
        console.error(error)
    })
}