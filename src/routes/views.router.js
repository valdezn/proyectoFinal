import express from 'express';
import { productModel } from '../daos/models/products.model.js';
import __dirname from "../utils.js";
import { cartsModel } from '../daos/models/carts.model.js';
import ProductController from '../controllers/views.controller.js'; 
import passport from "passport";
import { multipleRoles } from './middlewares/role.middleware.js';
import UsersController from '../controllers/users.controller.js';
import CartController from '../controllers/carts.controller.js';
import { UsersViewsController } from '../controllers/views.controller.js';


const productController = new ProductController()
const cartController = new CartController()
const usersController = new UsersController()
const usersViewsController = new UsersViewsController()

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

router.get('/resetPassword', passport.authenticate('jwtRequestPassword', { session: false , failureRedirect: 'requestResetPassword'}), (req, res) => {
  //sessionController.resetPassword;
  res.render('resetPassword');
})

router.get('/requestResetPassword', (req, res) => {
  //sessionController.requestResetPassword;
  res.render('requestResetPassword');
})

router.get('/products', passport.authenticate('jwt', { session: false , failureRedirect: '/login'}), productController.getProductsController);

router.get('/admin/users', passport.authenticate('jwt', { session: false }), multipleRoles(['admin']), async (req, res) => {
  const users = await usersViewsController.getUsersController(req, res)
  res.render('admin', users)
});

router.post('/admin/users/:email/edit', passport.authenticate('jwt', { session: false }), multipleRoles(['admin']), async (req, res) => {
  await usersController.editRoleController(req, res)
})

router.get('/admin/users/:email/delete', passport.authenticate('jwt', { session: false }), multipleRoles(['admin']), async (req, res) => {
  await usersController.deleteUserController(req, res)
})

router.get('/carts/:cid', async (req, res) => {
  await cartController.viewGetCartByIdController(req, res)     
})


router.get('/realtimeproducts', passport.authenticate('jwt', { session: false }), async (req, res) => { //
    let page = parseInt(req.query.page);
    if(!page) page=1;
    let result = await productModel.paginate({},{page,lean:true}) //lean hace que llegue el doc a handlebars como plain object y no como document.
    res.render('realTimeProducts.handlebars', result)
})


export default router;
  /*const id = req.params.cid;
    try {
      const cart = await cartsModel.findOne({ _id: id }).populate('products.product').lean();
      const productsInCart = cart.products;
      const empty = productsInCart.length
      if (empty === 0) {
        res.render('cart.handlebars')
      } else {
        res.render('cart.handlebars', { products: productsInCart, id })};
    } catch (error) {
      console.log(error);
      res.render('cartError.handlebars', { message: error });
    }*/