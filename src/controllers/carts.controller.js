import CartService from "../servicio/carts.service.js";

export default class CartController {
    constructor() {
      this.cartService = new CartService();
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
    async addProductToCartController(cid, pid) {
      const result = await this.cartService.addProductToCartService(cid, pid);
      return result;
    }
  }