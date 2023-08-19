import { Router } from "express";
import passport from "passport";
import { createHash, isValidPassword, authToken, generateToken } from "../utils.js";
import userModel from "../dao/models/users.js";
// import userModel from '../dao/models/users.js'
// import { initPassport } from './../config/passport.config.js';

const router = Router()

//api/sessions

//REGISTER & LOGIN with passport
//Updated clase 21 - passport con JWT, work in progress
router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    res.send({ status: 'succes', message: 'User registered' })
})
router.get('/failedregister', async (req, res) => {
    res.send({ error: 'Failed register.' })
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/failedlogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: 'error', error: 'Invalid credentials' })
    // console.log(req.user) //passport authentication, if successfull, returns the user info like in mongoDb in req.user
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        password: req.user.password,
        role: req.user.role
    }
    res.status(200).send({ status: 200, message: `${req.user.first_name} ${req.user.last_name} logged in.` })
})
router.get('/failedlogin', async (req, res) => {
    console.log('Login failed.')
    res.send({ error: 'Failed Login.' })
})

router.get('/api/current', authToken, (req, res) => { //codigo solo para testing de JWT
    res.send({ status: "success", payload: req.user })
})
//-------end register & login with passport

//GITHUB LOGIN
//Updated clase 21 - github
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});


//forever alone logout :'(
router.post('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (error) { res.status(400).send({ error: 'logout error', message: error }) }
        res.status(200).send('Session ended.')
    })
})

export default router
