import { Router } from "express";
import userModel from '../dao/models/users.js'
import passport from "passport";
import { createHash, isValidPassword } from "../utils.js";
import { initPassport } from './../config/passport.config.js';

const router = Router()


//api/sessions

//REGISTER with passport
//Updated clase 20 - passport.
router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    //el done le devuelve el user como respuesta exitosa
    res.send({ status: 'succes', message: 'User registered' })
})
router.get('/failedregister', async (req, res) => {
    console.log('Register failed.')
    res.send({ error: 'Failed register.' })
})
//-------end register with passport


router.post('/login', passport.authenticate('login', { failureRedirect: '/failedlogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: 'error', error: 'Invalid credentials' })
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
    }
    res.send({ status: "succes", payload: req.user })
})
router.get('/failedlogin', async (req, res) => {
    console.log('Login failed.')
    res.send({ error: 'Failed Login.' })
})

router.post('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (error) { res.status(400).send({ error: 'logout error', message: error }) }
        res.status(200).send('Session ended.')
    })
})

export default router
