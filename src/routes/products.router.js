import { Router } from "express"
import ProductManager from "../dao/dbManagers/productsManager.js"
import productModel from "../dao/models/products.js"


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

//ultimo update, clase 17 - mongoose II
router.get("/", async (req, res) => {
    //array de productos
    try {
        //Optimizado, validamos la query, si no existe, le otorgamos el valor por defecto.
        const sort = parseInt(req.query.sort) || -1;
        const category = req.query.category || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        //Armamos la pipeline del aggregate
        //skip va a calcular cuantos docs skipea, de acuerdo a la pagina en la que esta y el valor de limit
        //category, validacion, si tiene por query bien, sino se le asigna '' (devuelve todo sin filtrar)
        const skip = (page - 1) * limit;
        const categoryStage = category ? { category: category } : {};

        //countPipeline para saber de acuerdo al query, cuantos documentos en total quedan despues de los filtros
        const countPipeline = [
            { $match: categoryStage }, //filtra por categoria
            { $match: { stock: { $gt: 0 } } }, //$gt = 'greater than'
            { $count: 'totalCount' } //
        ]

        //totalCategoryCount, ejecuta la countPipeline el formato de devolucion
        //es el siguiente [ {"_id": null,"count": <number>  }]
        //como esta desestructurado, el formato seria el siguiente: {"_id": null,"count": <number>  }
        //se puede acceder al resutado con totalCategoryCount.length() (aunque no tenga sentido)
        const [totalCategoryCount] = await productModel.aggregate(countPipeline).exec();
        //totalProductCount, guarda el valor si es truthy, sino lo asigna
        const totalProductCount = totalCategoryCount ? totalCategoryCount.totalCount : 0

        //resultPipeline, esta es la pipeline que nos va a dar todos los valores que tenemos que devolver.
        const resultPipeline = [
            { $match: categoryStage },
            { $match: { stock: { $gt: 0 } } },
            { $sort: { price: sort } },
            { $skip: skip },
            { $limit: limit }
        ]
        const resultProducts = await productModel.aggregate(resultPipeline).exec()

        //paginacion mediante booleanos
        const hasNextPage = skip + resultProducts.length < totalProductCount; //booleano
        const hasPrevPage = page > 1; //booleano


        const response = {
            status: 'Available? Nose que deberia salir de status...',
            payload: resultProducts,
            totalPages: Math.ceil(totalProductCount / limit),
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page: page,
            hasPrevPage,
            hasNextPage, //mira donde me hace poner los links, te odio coder.
            prevLink: hasPrevPage ? `/api/products?category=${category}&page=${page - 1}&limit=${limit}&sort=${sort}` : null,
            nextLink: hasNextPage ? `/api/products?category=${category}&page=${page + 1}&limit=${limit}&sort=${sort}` : null,
        }
        //desde los primeros monos comiendo hongos y lamiendo sapos hasta chatGPT, todo valio la pena. GPT( •_•)>⌐■-■
        res.send(response)

    } catch (error) { //
        console.log(`product.router get failed, catch is ${error.message}`);
        res.status(500).send({ status: "error", message: error.message });
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
        return { status: 500, error: `product.router get failed, catch is ${error.message}` }
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