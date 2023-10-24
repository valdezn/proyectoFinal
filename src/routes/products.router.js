import { Router } from "express";
import __dirname from "../utils.js"
import ProductController from "../controllers/products.controller.js";
import passport from "passport";
import { multipleRoles } from "./middlewares/role.middleware.js";


const productController = new ProductController()
const router = Router();

router.get('/', async (req, res, next) => {
    await productController.getProductsController(req, res, next)
})

router.get('/:pid', async (req, res, next)=>{
    await productController.getProductByIdController(req, res, next)
})

router.post('/', passport.authenticate('jwt', {session: false}),
    multipleRoles(['admin', 'premium']), async (req, res, next) => {
        await productController.addProductController(req, res, next)
})

router.delete('/byStock/:pid', passport.authenticate('jwt', {session: false}),
    multipleRoles(['admin', 'premium']), async (req, res, next) => {
    await productController.deleteProductByStockController(req, res, next)
})

router.delete('/:pid', passport.authenticate('jwt', {session: false}),
    multipleRoles(['admin', 'premium']), async (req, res, next) => {
       await productController.deleteProductController(req, res, next)
})
router.put('/:pid', passport.authenticate('jwt', {session: false}),
    multipleRoles(['admin', 'premium']), async (req, res, next) => {
    await productController.updateProductController(req, res, next)
})

export default router;