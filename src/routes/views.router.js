import express from 'express';
import ProductManager from "../daos/clases/mongo/productsManager.js"
import CartManager from '../daos/clases/mongo/cartsManager.js';
import { productModel } from '../daos/models/products.model.js';
import __dirname from "../utils.js";
import { cartsModel } from '../daos/models/carts.model.js';


const productManager = new ProductManager()
const cartManager = new CartManager()
const router = express.Router();


router.get('/products', async (req, res) => {
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

  try {  
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

    res.render('home.handlebars', response);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).send('Error al obtener los productos');
  }
});


router.get('/carts/:cid', async (req, res) => {
    const id = req.params.cid;
    try {
      const cart = await cartsModel.findOne({ _id: id }).populate('products.product').lean();
      const productsInCart = cart.products;
      const empty = productsInCart.length
      if (empty === 0) {
        res.send('El carrito está vacío.')
      } else {
        res.render('cart.handlebars', { products: productsInCart })};
    } catch (error) {
      console.log(error);
      res.render('cartError.handlebars', { message: error });
    }
  });

router.get('/realtimeproducts', async (req, res) => { //
    let page = parseInt(req.query.page);
    if(!page) page=1;
    let result = await productModel.paginate({},{page,lean:true}) //lean hace que llegue el doc a handlebars como plain object y no como document.
    res.render('realTimeProducts.handlebars', result)
})


export default router;