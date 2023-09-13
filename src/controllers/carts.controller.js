import CartService from "../servicio/carts.service.js";
import ProductService from "../servicio/products.service.js";

export default class CartController {
    constructor() {
      this.cartService = new CartService();
      this.productService = new ProductService();
    }
  
    async createCartController() {
      const result = await this.cartService.createCartService();
      return result;
    }
  
    async getCartByIdContoller(id) {
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

      const result = await this.cartService.addProductToCartService(cartId, productId);
      return result;
  }}