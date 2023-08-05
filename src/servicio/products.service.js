import ProductManager from "../daos/clases/mongo/productsManager.js";

export default class ProductService {
  constructor() {
    this.productManager = new ProductManager();
  }

  async getProductsService(limit, page, sort, filter, filterVal) {
    const result = this.productManager.getProductsDao(
      limit,
      page,
      sort,
      filter,
      filterVal
    );
    return result;
    }

  async createProductService(product) {
    const result = await this.productManager.addProduct(product);
    return result;
  }


  async getProductsByIdService(id) {
    const result = await this.productManager.getProductById(id);

    if (!result) {
      return {
        error: "producto no existe",
      };
    }
    return result;
  }
}