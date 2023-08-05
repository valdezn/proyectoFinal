import { Router } from "express";
import CartController from "../controllers/carts.controller.js";
import CartManager from "../daos/clases/mongo/cartsManager.js";

const router = Router();

let cartManager = new CartManager();
let cartController = new CartController();


router.get("/:cid", async (req, res) => {
  let id = req.params.cid;

  let cart = await cartController.getCartByIdContoller(id);

  res.send(cart);
});

router.get("/", async (req, res) => {
  let carts = await cartManager.getCarts();

  if (!carts) {
    res.send("No se encontró el carritos");
    return;
  }

  res.send(carts);
});

router.post("/", async (req, res) => {
  const result = await cartController.createCartController();

  res.send({ result });
});

router.post("/:cid/product/:pid", async (req, res) => {
  let cartId = req.params.cid;
  let productId = req.params.pid;

  const result = await cartController.addProductToCartController(
    cartId,
    productId
  );

  res.send({ status: "success", result });
});

router.delete("/:cid/product/:pid", async (req, res) => {
  let cartId = req.params.cid;
  let productId = req.params.pid;

  await cartManager.deleteProductFromCart(cartId, productId);

  res.send({ status: "success" });
});

router.delete("/:cid", async (req, res) => {
  let cartId = req.params.cid;

  await cartManager.deleteAllProductsFromCart(cartId);

  res.send({ status: "success" });
});

export default router;

/*

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

export default router;*/