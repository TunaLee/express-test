import express from 'express';
import helloRouter from './hello.js'
import postRouter from './routers/post.js'
import userRouter from './routers/user.js'
import cors from 'cors'
import session from "express-session"
import MongStore from "connect-mongo"
import passport from './config/passport.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));

// app.use(
//     session({
//         secret: 'asdasdad',
//         resave: false,
//         saveUninitialized: false,
//         store: MongStore.create({
//             mongoUrl: "mongodb://127.0.0.1:27017/express-test"
//         }),
//         cookie: {
//             httpOnly: true,
//             maxAge: 1000*60*60
//         }
//     })
// )

// app.use(passport.authenticate("session"));
app.use((req, res, next)=> {
    if(!req.cookies['token']) {
        return next();
    }
    passport.authenticate(
        "jwt", 
        {session: false}
    )(req, res, next)
})

app.use('/posts', postRouter)
app.use('/auth', userRouter)
app.use((err, req, res, next)=> {
    res.status(500).json({message: err.message})
})

export default app;