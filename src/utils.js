//Paso Uno, crear utils
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import "dotenv/config";

const KEY = process.env.JASONWEBTOKEN_KEY

export const generateToken = (user) => {
    const token = jwt.sign({ user }, KEY, { expiresIn: '6h' })
    return token
}

export const authToken = (req, res, next) => {
    const headerAuth = req.headers.authorization
    if (!headerAuth) return res.status(401).send({ status: 'error', error: 'Not Autorized' })
    console.log('utils authToken headerAuth is:')
    console.log(headerAuth)
    const token = headerAuth.split(' ')[1] //porque viene en string y necesitamos solo el token id

    jwt.verify(token, KEY, (error, credentials) => {
        console.log(error)
        if (error) return res.status(401).send({ status: 'error', error: 'Not autorized second check.' })
        req.user = credentials.user
        next()
    })
}

// hashSync toma el password que pasemos y procede a aplicar un proceso de hasheo a partir de un "Salt".
// genSaltSync genera un Salt de 10 caracteres. Un Salt es una string random que hace que el  proceso
// de hasheo se realice de manera impredecible.
// Devuelve una string con el password hasheado. El proceso es IRREVERSIBLE.
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//compareSyync tomara primero el password sin hashear y lo compara con el password ya hasheado en la base 
//de datos. Devuelve true o false dependiendo si el password coincide o no.
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//de aca nos vamos a App.js
export default __dirname;