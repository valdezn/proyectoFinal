import Express from "express";
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import routerProducts from "./routes/products.router.js";
import routerChat from "./routes/chat.router.js";
import routerCarts from "./routes/carts.router.js";
import ProductManager from "./daos/clases/mongo/productsManager.js";
import CartManager from "./daos/clases/mongo/cartsManager.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import sessionRouter from './routes/session.router.js'
import passport from "passport";
import initializePassport from './config/passport.config.js';
import { initializePassportJWT } from "./config/jwt.passport.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import ChatManager from "./daos/clases/mongo/chatManager.js";
import routerMocks from './routes/mocks.router.js'
import { errorMiddleware } from "./servicio/error/error.middleware.js";
import { addLogger } from "./config/logger.config.js";
import routerLogger from "./routes/logger.router.js";
import routerEmail from "./routes/email.router.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import usersRouter from './routes/users.router.js'



dotenv.config({path: './.env'})

const chatManager = new ChatManager();
const productsManager = new ProductManager();
const cartManager = new CartManager();
const app = Express();
/*
app.use(
  session({
    store: new MongoStore({
      mongoUrl:
      'mongodb+srv://valdeznoelia26:coderhouse@cluster0.vxwlhyd.mongodb.net/ecommerce?retryWrites=true&w=majority'
    }),
    secret: "mongoSecret",
    resave: true,
    saveUninitialized: false,
  })
  );
  */
 
initializePassport();
initializePassportJWT();
app.use(passport.initialize());
app.use(cookieParser());
//app.use(passport.session());
 


const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentación ecommerce',
      description: 'Documentación del proyecto ecommerce.'
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}
 
const specs = swaggerJSDoc(swaggerOptions)
 
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.static(__dirname + '/public'));

const hbs = handlebars.create({
  helpers: {
    isEqual: function (a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    },
  },
});

app.engine("handlebars", hbs.engine);
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
    const result = await productsManager.deleteProductBySotck(productId);
    
    //envío a todos los sockets conectados la lista actualizada
    const updatedProducts = await productsManager.getProductsDao();
    const newProducts = await updatedProducts.docs
    console.log(newProducts)
    socketServer.emit("updatedProducts", newProducts);
  });
  
  socket.on('addToCart', async (cartId, productId) => {
    try {
      await cartManager.addProductInCart(cartId, productId);
      console.log(productId)
      console.log('Producto agregado al carrito con ID:', cartId);
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
    }
  });
  
  socket.on("message", async (data) => {
    console.log(data)
    mensajes.push(data);
    await chatManager.messagesSave(data);
    socketServer.emit("imprimir", mensajes);
  });
  
  socket.on('authenticatedUser', (data)=>{
    socket.broadcast.emit('newUserAlert', data)
  })
});


app.use((req, res, next) => {
  req.socketServer = socketServer;
  next()
});

app.use(addLogger);
app.use('/loggerTest/', routerLogger);

app.use('/chat/', routerChat);
app.use('/api/sessions', sessionRouter)
app.use('/', viewsRouter);
app.use('/api/products/', routerProducts);
app.use(errorMiddleware)
app.use('/api/carts/', routerCarts);
app.use('/mockingproducts/', routerMocks)
app.use('/email/', routerEmail)
app.use('/api/users/', usersRouter)
