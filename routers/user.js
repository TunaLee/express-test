import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/users.model.js";
import passport from "../config/passport.js"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import upload from "../modules/upload.module.js";

const router = Router();

router.post("/signup", upload.single('profileImage'), async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const profileImageUrl = req.file ? req.file.location : undefined;
  
  
      const user = await User.create({
        username,
        email,
        password, 
        profileImageUrl
      });
  
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: '회원가입 실패' });
    }
  });

router.post("/login", passport.authenticate("local", {
    failureMessage: true,
    session: false
}), (req, res) => {
    let token = null;
    if(req.user) {
        const _id = req.user._id;
        const payload = {_id};
        token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
    }
    res.cookie("token", token)
    res.json({message: 'login success!'})
})

router.post("/logout", (req, res)=> {
    req.logout(()=> {
        req.session.destroy(()=> {
            res.clearCookie('connect.sid');
            res.json({message: 'logout!'})
        })
    })
})

const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "dongwon1103@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD
    }
})

router.post("/send-email", async(req, res)=> {
    const {to, subject, text} = req.body;
    try {
        await transpoter.sendMail({
            from: "dongwon1103@gmail.com",
            to,
            subject,
            text
        })
        res.json({success: true})
    } catch (err) {
        res.status(500).json({success: false, message: err.message})
    }
})

router.get("/login/google", passport.authenticate("google", {scope: ["profile", "email"]}))

router.get("/login/google/callback",
    passport.authenticate("google", {session: false}),
    (req, res) => {
        let token = null;
        if(req.user) {
            const _id = req.user._id;
            const payload = {_id};
            token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
        }
        res.cookie("token", token)
        res.json({message: 'login success!'})
    }
)

export default router;