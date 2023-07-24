import { Router } from "express"
import ProductManager from "../dao/dbManagers/productsManager.js"

//router y manager
const router = Router()
const manager = new ProductManager()

//-------------Funciones de validacion
//funcion para validar strings
async function isString(value) {
    return typeof value === 'string';
}
//funcion para validar number
async function isNumber(value) {
    return typeof value === 'number';
}
//Funcion de validacion de datos de producto
async function checkProductValues(thisProduct) {
    try {
        //primer validacion, existencia de propiedades y tipo de dato de las mismas
        if (await isString(thisProduct.title) === true &&
            await isString(thisProduct.description) === true &&
            await isNumber(thisProduct.price) === true &&
            await isString(thisProduct.thumbnail) == true &&
            await isString(thisProduct.category) === true &&
            await isString(thisProduct.code) === true &&
            await isNumber(thisProduct.stock) === true) {
            console.log("Product Router: Validacion (existencia y tipo de datos) exitosa.")
            return true
        } else {
            console.log("Product Router: Validacion (existencia y tipo de datos) fallida.")
            return false
        }
    } catch (error) {
        console.log(`Product Router: checkProductValues resultado try/catch fallida, ${error.message}`)
    }
}
//-------------Fin funciones de validacion

//...api/products

//getAll con limite por query, funciona perfecto
router.get("/", async (req, res) => {
    //array de productos
    let products = await manager.getAll()
    if (products.length <= 0) {
        console.log("products.router: No products found in db.")
        res.send({ status: 'Error', message: 'Products collection is empty.' })
    } else {
        //query limit
        let limit = req.query.limit
        try {
            if (limit) {
                const limitedProducts = products.length - parseInt(limit)
                res.send(products.slice(limitedProducts))
            } else {
                res.send(products)
            }
        } catch (error) { console.log({ status: 'Error', message: error.message }) }
    }

})

//Optimized, saveProduct, funcionaba pero era un bardo, optimizado con chat gpt, quedo hecho un lujo. Gpt +1 Pankake
router.post('/', async (req, res) => {
    try {
        const thisProduct = req.body;
        const isProductValid = await checkProductValues(thisProduct);

        if (isProductValid) {
            const addStatus = await manager.saveProduct(thisProduct);

            if (addStatus.status === 'Success.') {
                console.log('Product Router Post, ok.');
                return res.send({ status: 'Success', message: `Product (${thisProduct.title}) pushed to db.` });
            }

            console.log('Product Router Post, failed try/catch.');
            return res.send(addStatus);
        }

        console.log('productRouter.post failed, check data.');
        res.send({ status: 'Error', message: 'Check product values.' });
    } catch (error) {
        console.log(`POST Products try failed, catch error: ${error.message}`);
        res.send({ status: 'Error', message: 'Post Product failed.' });
    }
});

//getProductById, id por params.
router.get("/:pid", async (req, res) => {
    let idProduct = req.params.pid
    const foundProduct = await manager.findProductById(idProduct)
    if (foundProduct) {
        res.send(foundProduct)
    } else {
        res.send({ status: 'Error', message: `GET Product/:pid failed, id not found.` })
    }
})

//updateProduct, id por params
router.put(`/:pid`, async (req, res) => {
    const newData = req.body
    let idProduct = req.params.pid
    const foundProduct = await manager.findProductById(idProduct)
    if (foundProduct) {
        try {
            const result = await manager.updateProduct(idProduct, newData)
            if (result.status === "Success.") {
                res.send(result)
            } else {
                res.send({ status: "Error.", message: `Product Router Put failed.` })
            }
        } catch (error) {
            console.log(`PUT Products try failed, catch is ${error.message}`)
            res.send({ status: "error", message: "Router catched an error." })
        }
    } else {
        res.send({ status: "Failed", message: `Router Put failed, product id not found in database.` })
    }
})

//deleteProductById, id por params.
router.delete('/:pid', async (req, res) => {
    try {
        const idProduct = req.params.pid;
        const foundProduct = await manager.findProductById(idProduct);

        if (foundProduct) {
            await manager.deleteProduct(idProduct);
            res.send({ status: 'Success.', message: `Product ${idProduct} deleted.` });
        } else {
            res.send({ error: 'Router Delete failed, id not found.' });
        }
    } catch (error) {
        res.send({ status: 'Error', message: error.message });
    }
});


export default router