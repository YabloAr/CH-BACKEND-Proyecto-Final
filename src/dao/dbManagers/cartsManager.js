import cartsModel from '../models/carts.js'
import ProductManager from './productsManager.js'
import mongoose from 'mongoose'



const productManager = new ProductManager()

export default class Carts {
    constructor() {
        console.log('dbManager: carts.js. Conectado a Mongo Atlas Db.')
    }

    createCart = async () => {
        try {
            let newCart = {
                "products": []
            }
            await cartsModel.create(newCart)
            return ({ status: 'Success.', message: 'Cart created.' })
        } catch (error) { return { status: "error", message: error.message } }

    }

    getAll = async () => {
        //.find vacio, devuelve todos los documentos de la coleccion.
        //.lean sirve para convertir documentos de una db no relacional a objetos json.
        let carts = await cartsModel.find().lean()
        return carts.length <= 0 ? ({ status: 'Error.', message: 'Carts collection is empty.' }) : (carts)
    }

    getCartById = async (id) => {
        return await cartsModel.findOne({ _id: id })
    }

    deleteCart = async (id) => {
        try {
            await cartsModel.deleteOne({ _id: id });
            return { status: 'Success.', message: `Cart ${id} deleted.` };
        } catch (error) {
            return { status: 'Error', message: error.message };
        }

    }


    addProductToCart = async (cartId, productId) => {
        try {
            const thisCart = await cartsModel.findById(cartId);

            if (!thisCart) {
                return { status: "failed", message: 'Cart doesnt exist, check id.' };
            }

            const productIndex = thisCart.products.findIndex((p) => p.product.toString() === productId); //el toString es necesario

            if (productIndex !== -1) {
                thisCart.products[productIndex].quantity += 1;
            } else {
                thisCart.products.push({ product: productId, quantity: 1 });
            }

            await cartsModel.findByIdAndUpdate(thisCart._id, thisCart);

            return { status: 'success', message: 'Product added.', payload: thisCart };
        } catch (error) {
            console.error(error);
            return { status: "error", message: `Try failed, catched error is ${error.message}` }
        };
    }

    deleteProductFromCart = async (cartId, productId) => {
        try {
            const thisCart = await cartsModel.findById(cartId);

            if (!thisCart) {
                return { status: 'failed', message: 'Cart does not exist, check ID.' };
            }

            const foundProduct = await productManager.findProductById(productId);
            if (!foundProduct) {
                return { status: 'failed', message: 'Product does not exist, check ID.' };
            }

            const productIndex = thisCart.products.findIndex((p) => p.product.toString() === productId);

            if (productIndex !== -1) {
                thisCart.products.splice(productIndex, 1);
                await cartsModel.findByIdAndUpdate(thisCart._id, thisCart);
                return { status: 'success', message: 'Product deleted.', payload: thisCart };
            } else {
                return { status: 'failed', message: 'Product not found in the cart.' };
            }
        } catch (error) {
            return { status: 'error', message: `Try failed, caught error: ${error.message}` };
        }
    };

}
