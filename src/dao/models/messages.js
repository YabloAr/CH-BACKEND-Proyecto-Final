import mongoose from "mongoose";

const collectionName = 'messages'

const messageSchema = mongoose.Schema({
    user: String,
    message: String,
})

//el primer parametro es un string con el nombre de la coneccion a la que queremos acceder
//el segundo es el esquema de datos de caad documento dentro
const messageModel = mongoose.model(collectionName, messageSchema)

export default messageModel