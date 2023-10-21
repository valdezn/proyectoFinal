import CartManager from "../daos/clases/mongo/cartsManager.js"
import ProductService from "./products.service.js";

export default class CartService {
    constructor() {
      this.cartDao = new CartManager();
      this.productService = new ProductService();
    }
  
    async createCartService() {
      const result = await this.cartDao.addCart();
      return result;
    }
  
    async getCartById(cartId) {
      const result = await this.cartDao.getCartById(cartId);
      if (!result) {
        return { error: "carrito no encontrado" };
      }
      return result;
    }
  
    async addProductToCartService(cartId, productId) {
      const product = await this.productService.getProductsByIdService(productId);
      const result = await this.cartDao.addProductInCart(cartId, productId);
      console.log(`cartId en service: ${cartId}`)
      return result;  
  }
  }