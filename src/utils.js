//Paso Uno, crear utils
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt' //cripterr

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