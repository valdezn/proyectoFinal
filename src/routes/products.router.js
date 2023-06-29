import { Router } from "express";
import ProductManager from "../daos/clases/mongo/productsManager.js";
import __dirname from "../utils.js"


const productManager = new ProductManager()
const router = Router();

router.get('/', async (req, res) => {
    try{
        let limit = Number(req.query.limit) || 10
        let page = Number(req.query.page)
        let sort = Number(req.query.sort)
        let filter = req.query.filter
        let filterVal = req.query.filterVal
        let products = await productManager.getProducts(limit, page, sort, filter, filterVal)
        res.send({products})
    } catch (error) {
        console.log('Productos no encontrados: ' +error)
    }
})

router.get('/:pid', async(req, res)=>{
    const product = await productManager.getProductById(req.params.pid)
    res.send(product)
})

router.post('/', async (req, res) => {
    const nProduct = req.body
    await productManager.addProduct(nProduct)
    const products = await productManager.getProducts();

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