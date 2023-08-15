import { Router } from "express";
import CartController from "../controllers/carts.controller.js";
import CartManager from "../daos/clases/mongo/cartsManager.js";
import { verificarCarrito } from "./middlewares/carts.middleware.js";
import passport from "passport";
import TicketsController from "../controllers/tickets.controller.js";
import {v4 as uuid} from 'uuid';


const router = Router();

let ticketsController = new TicketsController();
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

router.post("/:cid/product/:pid", passport.authenticate('jwt', {session: false}),
  verificarCarrito, async (req, res) => {
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

router.get('/:cid/purchase', passport.authenticate('jwt', {session: false}), async (req, res) => {
  let id = req.params.cid;
  let cart = await cartController.getCartByIdContoller(id);
  const purchasedProducts = [];
  const failedProducts = [];
  try{
    for (const cartProduct of cart.products) {
      const product = cartProduct.product;
      const desiredQuantity = cartProduct.quantity;

      if (product.stock >= desiredQuantity) {
        // Resto el stock del producto
        product.stock -= desiredQuantity;
        await product.save();

        purchasedProducts.push(product);

        const ticket = await ticketsController.addTicketController({
          code: uuid(), 
          purchaser: req.user.user.email, 
          amount: product.price * desiredQuantity,
        });
        await ticket.save();
      } else {
        failedProducts.push(product._id);
      }
    }
    // Actualizo el carrito con los productos no comprados
    cart.products = cart.products.filter(cartProduct =>
      failedProducts.includes(cartProduct.product)
    );
    await cart.save();
  
    // Devuelve respuesta con productos comprados y no comprados
    res.json({ purchasedProducts, failedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la compra.' });
  }
});

export default router;