import mongoose from "mongoose";

const collectionName = 'carts'

const cartSchema = mongoose.Schema({
    products: {
        type: Array,
        default: [
            {
                quantity: {
                    type: Number,
                    require: true,
                    default: 1
                }
            }
        ]
    }
})

//el primer parametro es un string con el nombre de la coneccion a la que queremos acceder
//el segundo es el esquema de datos de caad documento dentro
const cartModel = mongoose.model(collectionName, cartSchema)

export default cartModel