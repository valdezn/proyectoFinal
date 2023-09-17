import mongoose from "mongoose";
import { cartsModel } from "../../models/carts.model.js";
import ProductManager from "./productsManager.js";
///los llamados de un dao a otro dao no se recomiendan. Va en services

const productManager = new ProductManager()

export default class CartManager {
    connection = mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 30000 })
  
    addCart = async () => {
        const result = await cartsModel.create({products: []})
        return result
    }
    
    getCarts = async () => {
      const result = await cartsModel.find({})
      return result
    }

    getCartById = async (id) => {
        try {
            if (!mongoose.isValidObjectId(id)) {
              return `El carrito con id: '${id}' no existe.`;
            }
            const result = await cartsModel.findOne({ _id: id }).populate('products.product'); ///
            if (!result) return `El carrito con id: '${id}' no existe.`

            return result;
        } catch (error) {
          req.logger.error((`Error en el método ${req.method} llamando a 'getCartById'. ERROR: ${error}`))
          //console.log(error);
        }
    };
  
    addProductInCart = async (cid, pid) => {
        try {
          const cart = await this.getCartById(cid);

          if (typeof cart === 'string') {
            return cart; // El carrito no existe, retornar el mensaje de error
          }
      
          const product = await productManager.getProductById(pid);

          if (typeof product === 'string') {
            return product; // El producto no existe, retornar el mensaje de error
          }
          const productInCart = cart.products.find((product) => product.equals(pid))
          if (productInCart === undefined) {
            cart.products.push({ product: product, quantity: 1 });
          } else {
            await cartsModel.findOneAndUpdate(
              { _id: cart._id, "products.product": pid }, // Filtro para encontrar el carrito y el producto específico
              { $inc: { "products.$.quantity": 1 } } // Incremento la cantidad del producto en 1
            );
          }
          await cart.save();
          return "Status: success."
        } catch (error) {
          console.log('error')
          req.logger.error((`Error en el método ${req.method} llamando a 'addProductInCart'. ERROR: ${error}`))
          return//console.log(error);
        }
    };
    
    updateProductQuantityFromCart = async (cid, pid, quantity) => {
      let cartId = await this.getCartById(cid)
      if (cartId === `El carrito con id: '${cid}' no existe.`) return `El carrito con id: '${cid}' no existe.` //valido que exista el carrito

      let productIndex = cartId.products.findIndex((product) => product._id.toString() === pid); //valido que exista el producto dentro del carrito
      console.log(productIndex)
      if (productIndex === -1) return `El producto con id: '${pid}' no existe en el carrito '${cid}'.`;
      //es el id de la cantidad de productos y NO del producto en sí

      if (!quantity.hasOwnProperty('quantity')){
        return 'Propiedad inválida'
      }
      
      if (typeof quantity.quantity !== 'number'){
        return 'Valor inválido'
      }
      
      const newQuantity = quantity.quantity //accedo al número que paso por body
      await cartsModel.updateOne({"_id": cid, "products._id": pid}, {$set: {"products.$.quantity": newQuantity}})
      await cartId.save()
      return `Se ha actualizado la cantidad de unidades del producto '${pid}' a ${newQuantity} unidad/es.`  
    }

    updateProductsInTheCart = async (cid, updatedProduct) => {
      let cartId = await this.getCartById(cid)
      if (cartId === `El carrito con id: '${cid}' no existe.`) return `El carrito con id: '${cid}' no existe.` //valido que exista el carrito
    
      await cartsModel.updateOne({"_id": cid}, {$set: {"products": updatedProduct}})//seteo el nuevo arreglo de productos
      await cartId.save()
      return `Se ha actualizado el carrito con id: '${cid}'.`
    }


    deleteCart = async (id) => {
      let cartId = await this.getCartById(id)
      if (cartId === `El carrito con id: '${id}' no existe.`) return `El carrito con id: '${id}' que intenta eliminar no existe.`
      const result = await cartsModel.deleteOne({_id: id})
      return result
    }

    deleteProductFromCart = async (cid, pid) => {
      let cartId = await this.getCartById(cid)
      if (cartId === `El carrito con id: '${cid}' no existe.`) return `El carrito con id: '${cid}' no existe.`

      let productIndex = cartId.products.findIndex((product) => product._id.toString() === pid);
      if (productIndex === -1) return `El producto con id: '${pid}' no existe en el carrito ${cid}.`;
      //el id que recibo tiene que ser el de la cantidad de productos y NO la del producto en sí
      let quantityProduct = cartId.products[productIndex].quantity;
      if (quantityProduct > 1) {
        cartId.products[productIndex].quantity = quantityProduct - 1;
        await cartId.save()
        return `Se ha eliminado una unidad del producto con id: ${pid}`
      } else {
        cartId.products.pull({_id: pid})
      }
      await cartId.save()
      return `El producto con id: ${pid} ha sido eliminado del carrito con id: ${cid}`
    }

    deleteAllProductsFromCart = async (cid) => {
      let cartId = await this.getCartById(cid)
      if (cartId === `El carrito con id: '${cid}' no existe.`) return `El carrito con id: '${cid}' no existe.`
      cartId.products = []
      await cartId.save()
      return `Se han borrado todos los productos del carrito con id: ${cid}.`
    }
}