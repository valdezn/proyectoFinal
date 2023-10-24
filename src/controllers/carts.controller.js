import CartService from "../servicio/carts.service.js";
import ProductService from "../servicio/products.service.js";
import TicketsController from "./tickets.controller.js";


export default class CartController {
    constructor() {
      this.cartService = new CartService();
      this.productService = new ProductService();
      this.ticketsController = new TicketsController()
    }
  
    async createCartController(req, res) {
      const result = await this.cartService.createCartService();
      return res.send(result)
    }
  
    async getCartsController(req, res) {
      const result = await this.cartService.getCarts(req, res);
      return res.send(result);
    }

    async getCartByIdController(req, res) {
      const cartId = req.params.cid
      if (!cartId) {
        return {
          error: "debes especificar un id",
        };
      }
      const result = await this.cartService.getCartById(cartId);
      return res.send(result);
    }
    
    async addProductToCartController(req, res, next) {
      let cartId = req.params.cid;
      let productId = req.params.pid;

      let productOwner = await this.productService.getProductsByIdService(productId) 

      if (!productOwner || productOwner.owner === req.user.user.email) {
        if (!productOwner) {
          return res.status(403).send({ status: "error", details: "El producto no existe" });
        } else {
          return res.send({ status: "error", details: "You can't add an owner product" });
        }
      }
      
      ///console.log(`cartId en controller: ${cartId}`)
      const result = await this.cartService.addProductToCartService(cartId, productId);
      return res.send(result);
  }

  async updateProductsInTheCartController(req, res) {
    const idCart = req.params.cid;
    const updateProduct = req.body
    const updateCart = await cartManager.updateProductsInTheCart(idCart, updateProduct)
    return res.send(updateCart)
  }


  async updateProductQuantityFromCartController(req, res){
    const result = await this.cartService.updateProductQuantityFromCartService(req, res)
    return res.send(result)
  }

  async deleteAllProductsFromCartController(req, res){
    let cartId = req.params.cid;
    const result = await this.cartService.deleteAllProductsFromCartService(cartId)
    return res.send(result)
  }

  async deleteProductFromCartByStockController(req, res){
    const result = await this.cartService.deleteProductFromCartByStockSevice(req, res);
    return res.send(result)
  }

  async deleteProductFromController(req, res){
    const result = await this.cartService.deleteProductFromCartSevice(req, res);
    return result
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