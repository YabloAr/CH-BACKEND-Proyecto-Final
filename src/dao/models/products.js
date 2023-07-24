import mongoose from "mongoose";

const collectionName = 'products'

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
}
)

//el primer parametro es un string con el nombre de la coneccion a la que queremos acceder
//el segundo es el esquema de datos de caad documento dentro
const userModel = mongoose.model(collectionName, productSchema)

export default userModel