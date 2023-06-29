import Express from "express";
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import ProductManager from "./daos/clases/mongo/productsManager.js";
import CartManager from "./daos/clases/mongo/cartsManager.js";


const productsManager = new ProductManager();
const cartManager = new CartManager();
const app = Express();


app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.static(__dirname + '/public'));
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set('views', __dirname + '/views')


const expressServer = app.listen(8080, () => console.log("Listening"));
const socketServer = new Server(expressServer);


const mensajes = []

socketServer.on("connection", (socket) => {
  console.log("conected " + socket.id)
  //recibo el producto nuevo 
  socket.on('addProduct', async (product) => {     
      const result = await productsManager.addProduct(product);
    });
    //recibo el id del producto a eliminar
    socket.on("deleteProduct", async (product) => {  
      const productId = product
      const result = await productsManager.deleteProduct(productId);
      
      //envío a todos los sockets conectados la lista actualizada
      const updatedProducts = await productsManager.getProducts();
      const newProducts = updatedProducts.docs
      socketServer.emit("updatedProducts", newProducts);
    });
  
  socket.on('addToCart', async (productId) => {
    const cartId = '649b92000715b85820510f22' //único carrito disponible, si se borra hay que cambiar cid
    await cartManager.addProductInCart(cartId, productId);
    console.log('Producto agregado')
  });
});
  

app.use((req, res, next) => {
  req.socketServer = socketServer;
  next()
});

app.use('/', viewsRouter);
app.use('/api/products/', routerProducts);
app.use('/api/carts/', routerCarts);