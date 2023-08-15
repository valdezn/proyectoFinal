export const verificarCarrito = (req, res, next) =>{
    if(req.user.user.cartId === req.params.cid){
        next()
    }else{
        res.send("No puede agregar productos a otros carritos.")
    }
}