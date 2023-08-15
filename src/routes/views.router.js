import express from 'express';
import { productModel } from '../daos/models/products.model.js';
import __dirname from "../utils.js";
import { cartsModel } from '../daos/models/carts.model.js';
import ProductController from '../controllers/views.controller.js'; 
import passport from "passport";
import sessionController from '../controllers/session.controller.js';

const productController = new ProductController()

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/login');
})

router.get('/register', (req, res) => {
  res.render('register');
})

router.get('/login', (req, res) => {
  res.render('login');
})

router.get('/products', passport.authenticate('jwt', { session: false }), productController.getProductsController);


router.get('/carts/:cid', async (req, res) => {
    const id = req.params.cid;
    try {
      const cart = await cartsModel.findOne({ _id: id }).populate('products.product').lean();
      const productsInCart = cart.products;
      const empty = productsInCart.length
      if (empty === 0) {
        res.send('El carrito está vacío.')
      } else {
        res.render('cart.handlebars', { products: productsInCart })};
    } catch (error) {
      console.log(error);
      res.render('cartError.handlebars', { message: error });
    }
  });

  router.get('/realtimeproducts', passport.authenticate('jwt', { session: false }), async (req, res) => { //
    let page = parseInt(req.query.page);
    if(!page) page=1;
    let result = await productModel.paginate({},{page,lean:true}) //lean hace que llegue el doc a handlebars como plain object y no como document.
    res.render('realTimeProducts.handlebars', result)
})


export default router;