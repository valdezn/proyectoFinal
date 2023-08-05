import { productModel } from "../daos/models/products.model.js";
import userModel from "../daos/models/users.model.js";
import ProductService from "../servicio/products.service.js";

export default class ProductController {
    constructor() {
    this.productService = new ProductService();
    }

    async addProductController(product) {
        const result = await this.productService.addProductService(product);
        return result;
    }

    async getProductsController (req, res) {
        let limit = Number(req.query.limit) || 10
        let page = Number(req.query.page)
        let sort = Number(req.query.sort)
        let filter = req.query.filter
        let filterVal = req.query.filterVal
        const result = await this.productService.getProductsService(
          limit,
          page,
          sort,
          filter,
          filterVal
        );
        return result;
    }

    async getProductByIdController(id) {
        if(!id){
            return {
                error: 'id vacio'
            }
        }
        const result = await this.productService.getProductsByIdService(id);
        return result;
      }
}