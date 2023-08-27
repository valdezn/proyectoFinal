import { Router } from "express";
import ProductManager from "../daos/clases/mongo/productsManager.js";
import __dirname from "../utils.js"
import ProductController from "../controllers/products.controller.js";
import passport from "passport";
import { roleMiddlewareAdmin } from "./middlewares/role.middleware.js";


const productManager = new ProductManager()
const productController = new ProductController()
const router = Router();

router.get('/', async (req, res) => {
    try{
        let products = await productController.getProductsController(req)
        res.send({products})
    } catch (error) {
        console.log('Productos no encontrados: ' +error)
    }
})

router.get('/:pid', async(req, res, next)=>{
    await productController.getProductByIdController(req, res, next)
})

router.post('/', passport.authenticate('jwt', {session: false}),
    roleMiddlewareAdmin, async (req, res, next) => {
        await productController.addProductController(req, res, next)
})

router.delete('/:pid', passport.authenticate('jwt', {session: false}),
    roleMiddlewareAdmin, async (req, res) => {
    const pid = req.params.pid
    res.send(await productManager.deleteProductBySotck(pid))
})

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const updateProduct = req.body;
    res.send(await productManager.updateProduct(pid, updateProduct))
})

export default router;