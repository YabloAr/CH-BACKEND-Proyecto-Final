import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

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
//le agregamos el plugin al esquema
cartSchema.plugin(paginate)

//.model(nombre de la coleccion, esquema de los documentos)
const cartModel = mongoose.model(collectionName, cartSchema)

export default cartModel