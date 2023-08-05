//updated, Clase 20. Autorizacion y Autenticacion

import passport from 'passport'
import local from 'passport-local'
import userModel from '../dao/models/users.js'
import { createHash, isValidPassword } from '../utils.js'

//Inicializamos la estrategia local
const LocalStrategy = local.Strategy

//Basicamente la funcion de passport es gestionar autenticacion y autorizacion de usuarios
//en un modulo totalmente dedicado. Para mantener un codigo prolijo y con un buen orden modular.
//Podemos definir cada estrategia por separado, y exportar solamente el init vacio.

// gpt
// serializeUser and deserializeUser is a function used by Passport.js to serialize a user object into the session.
// Serializing a user means converting the user object into a format that can be easily stored in the session.
// This is typically done to reduce the amount of data stored in the session and to improve performance.
passport.serializeUser((user, done) => {
    done(null, user._id)
})
passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id)
    done(null, user)
})

//REGISTER strategy
//Nota que passport utiliza sus propios 'middlewares' de acuerdo a cada estrategia
passport.use('register', new LocalStrategy(
    //username sera en este caso el email
    //done sera el callback de resolucion de passport, el primer argumento es para error y el segundo para el usuario en caso de ser afirmativo.
    { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        //passReToCallback permite que se pueda acceder al objeto req como cualquier otro middleware.
        const { first_name, last_name, email, age, password: userPassword } = req.body
        try {
            let user = await userModel.findOne({ email: username })
            if (user) {
                console.log("User already exist.") //-->works ok
                //NO encontrar un usuario no significa que sea un error, asique el error se lo pasamos como null, pero al usuario como false
                //Esto significa "No ocurrio un error al buscar usuario, pero el usuario ya existe y no puedo dejarte continuar."
                return done(null, false)
            }
            const newUser = { first_name, last_name, email, age, password: createHash(userPassword) } //hasheamos el pass
            let result = await userModel.create(newUser)
            //Si todo sale ok, mandamos done(null, usuarioGenerado)
            //null entonces, significa que no hubo error. (Sino le pasamos el error) - result es el usuario, significando una respuesta afirmativa.
            return done(null, result)
        } catch (error) { return res.status(400).send({ status: "error", error: "" }) }
    }
))

//login strategy
passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (userEmail, password, done) => {
    try {
        const user = await userModel.findOne({ email: userEmail })
        if (!user) {
            console.log("passport.config login strat : user doesnt exist")
            return done(null, false)
        }
        if (!isValidPassword(user, password)) return done(null, false)
        return done(null, user)
    } catch (error) {
        return done(error)
    }
}))



export const initPassport = () => {/*Quedo vacio despues de la sacar la estrategia 'register' de adentro hecha en clase*/ }