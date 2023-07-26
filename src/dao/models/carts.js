import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const collectionName = 'carts'

const cartSchema = mongoose.Schema({
    products: {

        type: [
            {
                product: { //le decimos que debe tener un campo llamado product
                    type: mongoose.Schema.Types.ObjectId, //el cual sera del tipo ObjectId
                    ref: "products"//'products', esta es la referencia a la otra collection de la misma db.
                }
            }
        ],
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
//middleware, a partir de ahora, el .find en este modelo, devolvera el documento con la info del populate
cartSchema.pre('find', function () {
    this.populate('products.product')
})

//le agregamos el plugin al esquema
cartSchema.plugin(paginate)

//.model(nombre de la coleccion, esquema de los documentos)
const cartModel = mongoose.model(collectionName, cartSchema)

export default cartModel