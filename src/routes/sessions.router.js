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
    //el done le devuelve el user como respuesta exitosa
    res.send({ status: 'succes', message: 'User registered' })
})
router.get('/failedregister', async (req, res) => {
    console.log('Register failed.')
    res.send({ error: 'Failed register.' })
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/failedlogin' }), async (req, res) => {
    //generar una validacion de sesion activa, y despues continuar
    const user = req.user
    const accessToken = generateToken(user)
    res.status(200).send({ status: 200, accessToken }) //respondemos con la token generada
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
//
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    //Esta primer parte de la auth de github, pide los permisos al usuario para loguearse con su cuenta de github, y poder nosotros
    //acceder a su email
})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    // This route handles the callback from GitHub after the user has successfully authenticated.
    // If the authentication fails, the user will be redirected to /login as specified by the failureRedirect option.
    req.session.user = req.user // Store the authenticated user's data in the session
    // console.log(req.session.user)
    res.redirect('/') // Redirect the user to the homepage after successful authentication
});


//forever alone logout :'(
router.post('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (error) { res.status(400).send({ error: 'logout error', message: error }) }
        res.status(200).send('Session ended.')
    })
})

export default router
