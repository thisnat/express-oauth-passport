const express = require('express')
const router = express.Router()

const NoteSchema = require('../models/Note')

router.get('/:id', (req, res, next) => {
    if (req.user.id === req.params.id) {
        NoteSchema.find({ userId: req.params.id }, (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.send(data)
            }
        })
    } else {
        res.sendStatus(401)
    }
})

//should validate id
router.post('/', (req, res, next) => {
    let payload = {
        userId: req.body.userId,
        content: req.body.content
    }
    NoteSchema.create(payload, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
        }
    })
})

module.exports = router;
