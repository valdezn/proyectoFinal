import { Router } from "express";
import CartsManager from "../daos/clases/mongo/cartsManager.js";

const router = Router();
const cart = new CartsManager();

router.get('/', async (req, res) => {
    const limit = req.query.limit;
    if (!limit) return res.send(await cart.getCarts());
    const carts = await cart.getCarts();
    const cartLimit = carts.slice(0, limit)
    res.send(cartLimit)
})

router.get('/:cid', async (req, res) => {
    const cartById = await cart.getCartById(req.params.cid)
    res.send(cartById)
})

router.post('/', async (req, res) => {
    await cart.addCart();
    res.send({status: "success"})
})

router.post('/:cid/product/:pid', async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    res.send(await cart.addProductInCart(idCart, idProduct))    
})

router.put('/:cid/product/:pid', async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const quantity = req.body
    res.send(await cart.updateProductQuantityFromCart(idCart, idProduct, quantity))    
})

router.put('/:cid', async (req, res) => {
    const idCart = req.params.cid;
    const updateProduct = req.body
    res.send(await cart.updateProductsInTheCart(idCart, updateProduct))
})


router.delete('/:cid', async (req, res) => {
    res.send(await cart.deleteAllProductsFromCart(req.params.cid))
})

router.delete('/:cid/product/:pid', async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid; //es el id de la cantidad de productos y NO la del producto en sí
    res.send(await cart.deleteProductFromCart(idCart, idProduct))
})

export default router;