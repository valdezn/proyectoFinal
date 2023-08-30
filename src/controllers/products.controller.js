import ProductManager from "../daos/clases/mongo/productsManager.js";
import ProductService from "../servicio/products.service.js";
import { ErrorEnum } from "../servicio/error.enum.js";
import CustomError from "../servicio/customError.js";
import { generateErrorInfo } from "../servicio/info.js";
import mongoose from "mongoose";


export default class ProductController {
    constructor() {
    this.productService = new ProductService();
    this.productManager = new ProductManager();
    }

    addProductController = async (req, res, next) => {
        try{
            const {name, description, price, thumbnail, category, code, stock} = req.body
            if(!name || !description || !price || !thumbnail || !category || !code || !stock){
                CustomError.createError({
                    name: "product creation error",
                    cause: generateErrorInfo({
                        name,
                        description,
                        price,
                        thumbnail,
                        category,
                        code,
                        stock
                    }),
                    message: "error trying to create product",
                    code: ErrorEnum.INVALID_TYPES_ERROR,
                })
            }
            await this.productService.addProductService({name, description, price, thumbnail, category, code, stock})
            const products = await this.productManager.getProductsDao();
            
            req.socketServer.sockets.emit("updatedProducts", products)
            res.send({status: "success"})
        }catch (error){
            //console.log(`ERROR ${error}`)
            req.logger.error((`Error en el método ${req.method} llamando a 'addProductController'. ERROR: ${error}`))
            return next(error)
        }
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

    getProductByIdController = async (req, res, next) => {
        try{
            if (!mongoose.isValidObjectId(req.params.pid)){
                CustomError.createError({
                    name: 'id is not a valid',
                    cause: `the given id is not a object id Mongo`,
                    message: 'cannot get product',
                    code: ErrorEnum.PARAM_ERROR
                })
            }
            const product = await this.productService.getProductsByIdService(req.params.pid)
            res.send(product)
        }catch(error){
            req.logger.error((`Error en el método ${req.method} llamando a 'getProductByIdController'. ERROR: ${error}`))
            return next(error)
        }
    }
}