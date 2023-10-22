import { Router } from "express";
import CartController from "../controllers/carts.controller.js";
import CartManager from "../daos/clases/mongo/cartsManager.js";
import { verificarCarrito } from "./middlewares/carts.middleware.js";
import passport from "passport";
import TicketsController from "../controllers/tickets.controller.js";
import ProductController from "../controllers/products.controller.js";
import { processPurchase } from "./middlewares/carts.middleware.js";


const router = Router();

let cartManager = new CartManager();
let cartController = new CartController();
let productController = new ProductController()

router.get("/:cid", async (req, res) => {
  let id = req.params.cid;

  let cart = await cartController.getCartByIdController(id);

  res.send(cart);
});

router.get("/", async (req, res) => {
  let carts = await cartManager.getCarts();

  if (!carts) {
    res.send("No se encontraron los carritos");
    return;
  }

  res.send(carts);
});

router.post("/", async (req, res) => {
  const result = await cartController.createCartController();

  res.send({ result });
});

router.post("/:cid/product/:pid", passport.authenticate('jwt', {session: false}),
  verificarCarrito, async (req, res, next) => {
    try{
      const result = await cartController.addProductToCartController(req, res, next);
      res.send({ status: "success", result });
    }catch(e){
      res.status(500).json({ status: "error", details: "Internal server error" });
    }}  
)

router.put('/:cid', async (req, res) => {
  const idCart = req.params.cid;
  const updateProduct = req.body
  res.send(await cartManager.updateProductsInTheCart(idCart, updateProduct))
})

router.put('/:cid/product/:pid', async (req, res) => {
  const idCart = req.params.cid;
  const idProduct = req.params.pid;
  const quantity = req.body
  res.send(await cartManager.updateProductQuantityFromCart(idCart, idProduct, quantity))    
})
  
router.delete("/:cid/product/:pid", async (req, res) => {
  await cartManager.deleteProductFromCart(req, res);
  res.send({ status: "success" });
});

router.delete("/:cid", async (req, res) => {
  let cartId = req.params.cid;

  await cartManager.deleteAllProductsFromCart(cartId);

  res.send({ status: "success" });
});

router.get('/:cid/purchase', passport.authenticate('jwt', { session: false }), processPurchase);




/*router.get('/:cid/purchase', passport.authenticate('jwt', {session: false}), async (req, res) => {
  let id = req.params.cid;
  let cart = await cartController.getCartByIdContoller(id);
  const purchasedProducts = [];
  const failedProducts = [];
  console.log(`stock: ${cart}`)
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
    req.logger.error((`Error en el método ${req.method} llamando a ''. ERROR: ${error}`))
    //console.error(error);
    res.status(500).json({ error: 'Error al procesar la compra.' });
  }
});*/

export default router;