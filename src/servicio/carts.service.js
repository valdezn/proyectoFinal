import CartManager from "../daos/clases/mongo/cartsManager.js"

export default class CartsService {
    constructor(){
        this.CartManager = CartManager()
    }
 
}