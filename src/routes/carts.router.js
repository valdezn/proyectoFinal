import { Router } from "express";
import CartController from "../controllers/carts.controller.js";
import { verificarCarrito } from "./middlewares/carts.middleware.js";
import passport from "passport";
import { processPurchase } from "./middlewares/carts.middleware.js";


const router = Router();

let cartController = new CartController();


router.get("/:cid", async (req, res) => {
  await cartController.getCartByIdController(req, res);
});

router.get("/", async (req, res) => {
  await cartController.getCartsController(req, res);
});

router.post("/", async (req, res) => {
  await cartController.createCartController(req, res);
});

router.post("/:cid/product/:pid", passport.authenticate('jwt', {session: false}),
  verificarCarrito, async (req, res, next) => {
      await cartController.addProductToCartController(req, res, next);
})

router.put('/:cid', async (req, res) => {
  await cartController.updateProductsInTheCartController(req, res)
})

router.put('/:cid/product/:pid', async (req, res) => {
  await cartController.updateProductQuantityFromCartController(req, res)    
})
  
router.delete("/:cid/product/stock/:pid", async (req, res) => {
  await cartController.deleteProductFromCartByStockController(req, res);
});

router.delete("/:cid/product/:pid", async (req, res) => {
  await cartController.deleteProductFromController(req, res);
});

router.delete("/:cid", async (req, res) => {
  await cartController.deleteAllProductsFromCartController(req, res)
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