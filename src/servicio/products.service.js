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

  async addProductService(product) {
    const result = await this.productManager.addProduct(product);
    return result;
  }


  async getProductsByIdService(req, productId) {
    const result = await this.productManager.getProductById(productId);

    if (!result) {
      req.logger.error((`Error en el método ${req.method} llamando a 'getProductByIdService'.`))
      return {
        error: "producto no existe",
      };
    }
    return result;
  }

  async updateProductService(id, product) {
    const result = await this.productManager.updateProduct(id, product);
    return result;
  }

  async deleteProductBySotckService(pid) {
    console.log(pid)
    const result = await this.productManager.deleteProductBySotck(pid)
    return result
  }
}