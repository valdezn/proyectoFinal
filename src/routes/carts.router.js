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

export default router;