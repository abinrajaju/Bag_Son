const express = require('express')
const app = express()
const path = require('path')
const connectDB = require('./server/connection/connection')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const bodyparser = require('body-parser')
const cookies = require('cookie-parser')
const cookieParser = require('cookie-parser')
const nocache = require('nocache')
const session = require('express-session')
const { v4: uuidv4 } = require('uuid')
const passport = require('passport')
require('passport-google-oauth20').Strategy
require('./server/middleware/auth')




dotenv.config({ path: 'config.env' })
const port = process.env.port || 2001
connectDB()

app.set("view engine", "ejs")
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieParser())
app.use(nocache())


//session create
app.use(session({
    secret: uuidv4(),
    cookie: { maxAge: 3600000 },
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())


//auth google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

//callback for googlr authentication
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/usersignup' }), async (req, res) => {
        const userToken = req.user.userToken;
        const decodedToken = jwt.verify(userToken, 'your_key');
         
        req.session.email = decodedToken.email;
        res.cookie('userToken', userToken)
        res.redirect('/')
    })



app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.resolve(__dirname, ("assets/css"))))
app.use('/uploads', express.static(path.join(__dirname, "uploads")));
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use('/', require('./server/routes/admin'));
app.use('/', require('./server/routes/user'))




app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}  `);
})



