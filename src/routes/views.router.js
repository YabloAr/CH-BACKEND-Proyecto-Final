import { Router } from "express";
import CartManager from '../dao/dbManagers/cartsManager.js'
import productModel from "../dao/models/products.js";

const cartManager = new CartManager()

const router = Router()

//Router de productos con PAGINATE
//cuando agregue el query de sort se complico muchisimo
router.get('/', async (req, res) => {
    try {
        //Optimizado, validamos la query, si no existe, le otorgamos el valor por defecto.
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const sort = parseInt(req.query.sort) || -1
        const category = req.query.category || ''

        //Armamos la pipeline del aggregate
        const skip = (page - 1) * limit; //calcula algo que nose
        const matchStage = category ? { category: category } : {}; //Si existe joya, sino lo deja vacio

        const countPipeline = [ //variable condicional
            { $match: matchStage }, //se filtra por category, si esta vacio devuelve todo sin filtrar
            { $count: 'totalCategoryCount' },//$count siempre va a devolver la cantidad de docs, el string es libre
        ];
        //ejecuta la pipeline para obtener el resultado
        const totalCountResult = await productModel.aggregate(countPipeline).exec();
        //totalCounResult no es un array, pero length igual recibe el dato. Se usa en hasNextPage
        const totalCategoryCount = totalCountResult.length > 0 ? totalCountResult[0].totalCategoryCount : 0;

        //pasamos los valores a la pipeline
        const pipeline = [
            { $match: matchStage },
            { $sort: { price: sort } },
            { $skip: skip },
            { $limit: limit },
        ];

        const products = await productModel.aggregate(pipeline).exec();
        //validaciones de cantidad de paginas segun resultados anteriores
        const hasNextPage = skip + products.length < totalCategoryCount; //boolean
        const hasPrevPage = page > 1;//boolean
        const nextPage = hasNextPage ? page + 1 : null;
        const prevPage = hasPrevPage ? page - 1 : null;

        //finalmente le enviamos mediante el render, los datos necesarios para los handlebars.
        res.render('products', { products, hasPrevPage, hasNextPage, prevPage, nextPage, limit, sort, category })

    } catch (error) { return { status: 'error', error: error.message } }
})

//Router de carts
router.get('/carts', async (req, res) => {
    let carts = await cartManager.getAll() //le enviamos mediante el render, los datos necesarios para los handlebars.
    res.render('carts', { carts })
})

//Router de aplicacion chat
router.get('/chat', (req, res) => {
    res.render('chat', {
        style: 'index.css'
    })
})

export default router