import { Router } from "express";
import ProductManager from "../daos/clases/mongo/productsManager.js";
import __dirname from "../utils.js"
import ProductController from "../controllers/products.controller.js";
import passport from "passport";
import { roleMiddlewareAdmin } from "./middlewares/role.middleware.js";
import { ErrorEnum } from "../servicio/error.enum.js";
import { generateErrorInfo } from "../servicio/info.js";
import CustomError from "../servicio/customError.js";

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
    if (isNaN(req.params.pid)){
        CustomError.createError({
            name: 'id is not a number',
            cause: `the given id is not a number`,
            message: 'cannot get users',
            code: ErrorEnum.PARAM_ERROR
        })
    }
    const product = await productController.getProductByIdController(req.params.pid)
    res.send(product)
})

router.post('/', passport.authenticate('jwt', {session: false}),
    roleMiddlewareAdmin, async (req, res) => {
    const {name, description, price, thumbnail, category, code, stock} = req.body
    if(!name || !description || !price || !thumbnail || !category || !code || !stock){
        CustomError.createError({
            name: "product creation error",
            cause: generateErrorInfo({
                name,
                description,
                price,
                thumbnail,
                category,
                code,
                stock
            }),
            message: "error trying to create product",
            code: ErrorEnum.INVALID_TYPES_ERROR,
        })
       return
    }
    await productController.addProductController({name, description, price, thumbnail, category, code, stock})
    const products = await productManager.getProductsDao();

    req.socketServer.sockets.emit("updatedProducts", products)
    res.send({status: "success"})
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