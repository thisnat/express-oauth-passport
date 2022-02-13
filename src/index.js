const express = require('express')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
require('dotenv').config()
require('./passport')

const app = express()
const PORT = process.env.PORT || 2626
const CLIENT_END_POINT = process.env.CLIENT_END_POINT || "http://localhost:3000"

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors({
    origin: CLIENT_END_POINT,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));

app.get('/heartbeat', (req, res) => {
    res.send({ "status": "ok" })
})

app.get("/getuser", (req, res) => {
    if (req.user){
        res.send(req.user)
    } else {
        res.sendStatus(404)
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

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
