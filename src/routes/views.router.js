import { Router } from "express";
import Carts from '../dao/dbManagers/cartsManager.js' //duda, importarlo con mayuscula inicial es buena practica o es necesario?
import Products from '../dao/dbManagers/productsManager.js' //misma duda

const productManager = new Products()
const cartManager = new Carts()

const router = Router()

//Router de productos
router.get('/', async (req, res) => {
    let products = await productManager.getAll()
    res.render('products', { products }) //le enviamos mediante el render, los datos necesarios para los handlebars.

})

//Router de carts
router.get('/carts', async (req, res) => {
    let carts = await cartManager.getAll() //le enviamos mediante el render, los datos necesarios para los handlebars.
    res.render('carts', { carts })
})

//Router de aplicacion chat
router.get('/chat', (req, res) => {
    res.render('index', {
        style: 'index.css'
    })
})

export default router