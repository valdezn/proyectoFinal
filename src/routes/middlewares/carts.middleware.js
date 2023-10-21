import CartController from "../../controllers/carts.controller.js"
import TicketsController from "../../controllers/tickets.controller.js"
import { cartsModel } from "../../daos/models/carts.model.js";
import {v4 as uuid} from 'uuid';
import { ticketsModel } from "../../daos/models/tickets.model.js";


const cartController = new CartController()
const ticketsController = new TicketsController()

export const verificarCarrito = (req, res, next) =>{
    if(req.user.user.cartId === req.params.cid){
        next()
    }else{
        res.send("No puede agregar productos a otros carritos.")
    }
}

// Función para procesar la compra

export const processPurchase = async (req, res) =>  {
    const cartId = req.params.cid;
    var cart = await cartsModel.findOne({_id: cartId}).populate('products.product');
    const purchasedProducts = [];
    const failedProducts = [];
    var amountTicket = 0
    var idProducts = []
    //console.log(`stock: ${cart}`);

    console.log(`cart: ${cart}`)
    try {
      for (const cartProduct of cart.products) {
        var product = cartProduct.product;
        var desiredQuantity = cartProduct.quantity;
        if (product.stock >= desiredQuantity) {
          // Resto el stock del producto
          product.stock -= desiredQuantity;
          await product.save();
          purchasedProducts.push(product);
          
          var amountProductPrice = product.price * desiredQuantity
          console.log(product.price)
          amountTicket += amountProductPrice;
          
          var idProduct = product._id

          idProducts.push(idProduct)

        } else {
          failedProducts.push(product._id);
        }
      }

      var ticket = await ticketsController.addTicketController({
        code: uuid(),
        purchaser: req.user.user.email,
        amount: amountTicket
      });
      await ticket.save();
      //console.log(`ticket: ${ticket}`)
      //console.log(`idProducts: ${idProducts}`)
      // Actualizo el carrito con los productos no comprados
      cart.products = cart.products.filter((cartProduct) =>
        failedProducts.includes(cartProduct.product)
      );
      await cart.save();
      // Devuelve respuesta con productos comprados y no comprados
      res.render('ticket', ( ticket ));
    } catch (error) {
      req.logger.error(
        (`Error en el método ${req.method} llamando a 'processPurchase'. ERROR: ${error}`)
      );
      res.status(500).json({ error: 'Error al procesar la compra.' });
    }
  }