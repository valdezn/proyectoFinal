import { Router } from "express";
import ProductManager from "../daos/clases/mongo/productsManager.js";
import __dirname from "../utils.js"
import ProductController from "../controllers/products.controller.js";

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

router.get('/:pid', async(req, res)=>{
    const product = await productController.getProductByIdController(req.params.pid)
    res.send(product)
})

router.post('/', async (req, res) => {
    const nProduct = req.body
    await productController.addProductController(nProduct)
    const products = await productManager.getProductsDao();

    req.socketServer.sockets.emit("updatedProducts", products)
    res.send({status: "success"})
})

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid
    res.send(await productManager.deleteProduct(pid))
})

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const updateProduct = req.body;
    res.send(await productManager.updateProduct(pid, updateProduct))
})

export default router;