import UserManager from "../daos/clases/mongo/userManager.js";
import { productModel } from "../daos/models/products.model.js";
import userModel from "../daos/models/users.model.js";
import ProductService from "../servicio/products.service.js";
import UserDTO from "./DTO/user.dto.js";

export default class ProductController {
    constructor() {
    this.productService = new ProductService();
    }
    async getProductsController (req, res) {
    try{
        let page = req.query.page;
        if (!page) page=1

        const { category, stock, sortBy, sortDirection } = req.query;
        
        const query = {};

        // Filtro por categoría (?category=resma)
        if (category) {
        query.category = category;
        }
        // Filtro por disponibilidad (?stock=10)
        if (stock) {
        query.stock = { $gte: parseInt(stock) };
        }

        // Ordeno por precio con sortDirection (?sortBy=price&sortDirection=desc) o 'asc'
        const sort = {};
        if (sortBy === 'price') {
        sort.price = sortDirection === 'desc' ? -1 : 1;
        }

        const options = {
        page: page,
        limit: 5,
        lean: true,
        sort: sort
        };
    
        //const userName = req.user;
        //const userLog = await userModel.findOne({email: userName.user.email})
        const userLog = new UserDTO(req.user.user)
        const email = userLog.email
        const rol = userLog.role;
        const firstName = userLog.first_name;
        const cartId = userLog.cart;
        console.log(userLog)
        //console.log(`Rol del usuario: ${rol}`);
        const result = await productModel.paginate(query, options);
        if (isNaN(page) || page <= 0 || page > result.totalPages) {
            res.status(404).render('error404.handlebars');
            return; //devuelve error si la pagina no es un numero, es negativo o supera el total de pags.
        }
        const response = {
            docs: result.docs,
            prevLink: result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '',
            nextLink: result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '',
            isValid: result.page >= 1 && result.page <= result.totalPages,
            count: result.totalDocs,
            page: result.page,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage
        };
        
        res.render('home.handlebars', {...response, email, firstName, rol, cartId, req});
        } catch (error) {
        //console.error('Error al obtener los productos:', error);
        req.logger.error(`Error en el método ${req.method} llamando a 'getProductsController'. ERROR: ${error}`)
        res.status(500).send('Error al obtener los productos');
        }
    }
}

export class UsersViewsController {
    constructor() {
    this.usersManager = new UserManager;
    }
    async getUsersController (req, res, next) {
        let limit = Number(req.query.limit) || 10
        let page = Number(req.query.page)
        let sort = Number(req.query.sort)
        let filter = req.query.filter
        let filterVal = req.query.filterVal
        const result = await this.usersManager.getUsers(
          limit,
          page,
          sort,
          filter,
          filterVal
        );

    return result;
}}
