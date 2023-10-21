import CartService from "../servicio/carts.service.js";
import ProductService from "../servicio/products.service.js";
import TicketsController from "./tickets.controller.js";
import { cartsModel } from "../daos/models/carts.model.js";


export default class CartController {
    constructor() {
      this.cartService = new CartService();
      this.productService = new ProductService();
      this.ticketsController = new TicketsController()
    }
  
    async createCartController() {
      const result = await this.cartService.createCartService();
      return result;
    }
  
    async getCartByIdController(id) {
      if (!id) {
        return {
          error: "debes especificar un id",
        };
      }
      const result = await this.cartService.getCartById(id);
      return result;
    }
    
    async addProductToCartController(req, res, next) {
      let cartId = req.params.cid;
      let productId = req.params.pid;

      let productOwner = await this.productService.getProductsByIdService(productId) 
      if(productOwner.owner === req.user.user.email){
        res.send({status: "error", details: "you can't add owner product"})
      }
      console.log(`cartId en controller: ${cartId}`)
      const result = await this.cartService.addProductToCartService(cartId, productId);
      return result;
  }

  async viewGetCartByIdController(req, res){
    const id = req.params.cid;
    try {
      const cart = await this.cartService.getCartById(id)
      const productsInCart = cart.products;
      const empty = productsInCart.length
      if (empty === 0) {
        res.render('cart.handlebars')
      } else {
        res.render('cart.handlebars', { products: productsInCart, id })};
    } catch (error) {
      console.log(error);
      res.render('cartError.handlebars', { message: error });
    }
  }
}