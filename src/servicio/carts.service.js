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
  
    async getCartById(id) {
      const result = await this.cartDao.getCartById(id);
      if (!result) {
        return { error: "carrito no encontrado" };
      }
      return result;
    }
  
    async addProductToCartService(cid, pid) {
      const product = await this.productService.getProductsByIdService(pid);
      const result = await this.cartDao.addProductInCart(cid, pid);
      return result;  
  }
  }