import ProductManager from "../daos/clases/mongo/productsManager.js";
import ProductService from "../servicio/products.service.js";
import { ErrorEnum } from "../servicio/error.enum.js";
import CustomError from "../servicio/customError.js";
import { generateErrorInfo } from "../servicio/info.js";
import mongoose from "mongoose";
import UsersController from "./users.controller.js";
import UserDTO from "./DTO/user.dto.js";
import nodemailer from 'nodemailer'


const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.EMAIL_PASS
    },
});

const usersController = new UsersController()

export default class ProductController {
    constructor() {
    this.productService = new ProductService();
    this.productManager = new ProductManager();
    }

    addProductController = async (req, res, next) => {
        try{
            const {name, description, price, thumbnail, category, code, stock, owner} = req.body
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
            
            const newProduct = req.body
            if(req.user.user.email != process.env.ADMIN_EMAIL){
                newProduct.owner = req.user.user.email      
            }

            await this.productService.addProductService(newProduct)
            const products = await this.productManager.getProductsDao();
            
            req.socketServer.sockets.emit("updatedProducts", products)
            res.send({status: "success"})
        }catch (error){
            req.logger.error((`Error en el método ${req.method} llamando a 'addProductController'. ERROR: ${error}`))
            return next(error)
        }
    }

    async getProductsController (req, res, next) {
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
        res.send(result)
        return;
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
            if(!product) {
                return res.status(403).
                send({ status: "error", details: "El producto no existe" })
            }
            return res.send(product)
        }catch(error){
            req.logger.error((`Error en el método ${req.method} llamando a 'getProductByIdController'. ERROR: ${error}`))
            return next(error)
        }
    }

    updateProductController = async (req, res, next) => {
        try{
            const productId = req.params.pid
            const {name, description, price, thumbnail, category, code, stock} = req.body
            if(!name || !description || !price || !thumbnail || !category || !code || !stock){
                CustomError.createError({
                    name: "product update error",
                    cause: generateErrorInfo({
                        name,
                        description,
                        price,
                        thumbnail,
                        category,
                        code,
                        stock
                    }),
                    message: "error trying to update product",
                    code: ErrorEnum.INVALID_TYPES_ERROR,
                })
            }
            await this.productService.updateProductService(productId, {name, description, price, thumbnail, category, code, stock})
            
            res.send({status: "success"})
        }catch (error){
            req.logger.error((`Error en el método ${req.method} llamando a 'updateProductController'. ERROR: ${error}`))
            return next(error)
        }
    }

    
    deleteProductByStockController = async (req, res, next) => {
        var userStringify = new UserDTO(req.user.user)
        try{
            if (!mongoose.isValidObjectId(req.params.pid)){
                CustomError.createError({
                    name: 'id is not a valid',
                    cause: `the given id is not a object id Mongo`,
                    message: 'cannot delete product',
                    code: ErrorEnum.PARAM_ERROR
                })
            }

            const productOwner = await this.productService.getProductsByIdService(req.params.pid)

            if(!productOwner) {
                return res.status(403).
                send({ status: "error", details: "El producto no existe" })
            }

            if ( !(userStringify.role === "admin" || productOwner.owner === userStringify.email) ) {
                return res.status(403).
                send({ status: "error", details: "You don't have access. You are not the product owner" })
            }

            const product = await this.productService.deleteProductBySotckService(req.params.pid)
            const userProduct = productOwner.owner
            var user = await usersController.getUserController(userProduct)
            console.log(user[0].role)
            if (user[0].role === "premium") {
                var role = user[0].role
            }

            if(userProduct != 'admin' && role === 'premium'){

                    let result = await transport.sendMail({
                        from: "valdeznoelia26@gmail.com",
                        to: user[0].email,
                        subject: "Warning",
                        html: `
                        <div style='color:blue'>
                        <h1>Se ha eliminado una unidad de un producto que usted creó: ${req.params.pid}</h1>
                        </div>`
                    });
                    result
                }
            res.send(`Se ha eliminado una unidad del producto ${req.params.pid}.`)
        }catch(error){
            req.logger.error((`Error en el método ${req.method} llamando a 'deleteProductByStockController'. ERROR: ${error}`))
            return next(error)
        }
    }

    deleteProductController = async (req, res, next) => {
        var userStringify = new UserDTO(req.user.user)
        try{
            if (!mongoose.isValidObjectId(req.params.pid)){
                CustomError.createError({
                    name: 'id is not a valid',
                    cause: `the given id is not a object id Mongo`,
                    message: 'cannot delete product',
                    code: ErrorEnum.PARAM_ERROR
                })
            }
            const productOwner = await this.productService.getProductsByIdService(req.params.pid)

            if(!productOwner) {
                return res.status(403).
                send({ status: "error", details: "El producto no existe" })
            }

            if ( !(userStringify.role === "admin" || productOwner.owner === userStringify.email) ) {
                return res.status(403).
                send({ status: "error", details: "You don't have access. You are not the product owner" })
            }

            const product = await this.productService.deleteProductService(req.params.pid)
            const userProduct = productOwner.owner
            var user = await usersController.getUserController(userProduct)
            console.log(user[0].role)
            if (user[0].role === "premium") {
                var role = user[0].role
            }
            if(userProduct != 'admin' && role === 'premium'){

                    let result = await transport.sendMail({
                        from: "valdeznoelia26@gmail.com",
                        to: user[0].email,
                        subject: "Warning",
                        html: `
                        <div style='color:blue'>
                        <h1>Se ha eliminado un producto que usted creó: ${req.params.pid}</h1>
                        </div>`
                    });
                    result
                }
            res.send(`Se ha eliminado el producto ${req.params.pid}.`)
        }catch(error){
            req.logger.error((`Error en el método ${req.method} llamando a 'deleteProductController'. ERROR: ${error}`))
            return next(error)
        }
    }
}