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

    async getCarts(req, res) {
      const result = await this.cartDao.getCarts();
      if (!result) {
        return { error: "error al obtener los carritos." };
      }
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
      //console.log(`cartId en service: ${cartId}`)
      return result;  
  }

    async updateProductQuantityFromCartService(req, res){
      const idCart = req.params.cid;
      const idProduct = req.params.pid;
      const quantity = req.body
      const result = await this.cartDao.updateProductQuantityFromCart(idCart, idProduct, quantity)
      return result
    }

    async deleteProductFromCartByStockSevice(req, res){
      const result = await this.cartDao.deleteProductFromCartByStock(req, res)
      return result
    }

    async deleteProductFromCartSevice(req, res){
      const result = await this.cartDao.deleteProductFromCart(req, res)
      return result
    }

    async deleteAllProductsFromCartService(cartId){
      const result = await this.cartDao.deleteAllProductsFromCart(cartId)
      return result
    }
  }