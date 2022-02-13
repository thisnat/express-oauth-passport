const express = require('express')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
const mongoose = require('mongoose')
const noteRouter = require('./routes/NoteRouter')
require('dotenv').config()
require('./passport')

const app = express()
const PORT = process.env.PORT || 2626
const CLIENT_END_POINT = process.env.CLIENT_END_POINT || "http://localhost:3000"

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('database connected')
}, err => {
    console.log(`cant connect database : ${err}`)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors({
    origin: CLIENT_END_POINT,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}))
app.set('trust proxy', 1)

app.get('/heartbeat', (req, res) => {
    res.send({ "status": "ok" })
})

app.get("/getuser", (req, res) => {
    if (req.user) {
        res.send(req.user)
    } else {
        res.sendStatus(401)
    }
})

app.get('/logout', (req, res) => {
    req.logout()
    req.session.destroy()
    res.redirect(CLIENT_END_POINT)
})

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }
    ))

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: CLIENT_END_POINT,
        failureRedirect: '/auth/google/failure'
    })
)

app.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate..')
})

app.use('/note', noteRouter)

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
