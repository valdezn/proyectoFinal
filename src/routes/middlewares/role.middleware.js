export const roleMiddlewareAdmin = (req, res, next) => {
    if(req.user.user.role === 'admin'){
        next()
    }else{
        res.send({status: "error", details: "you don't have access"})
    }
}

export const roleMiddlewareUser = (req, res, next) => {
    if(req.user.user.role === 'user'){
        next()
    }else{
        res.send({status: "error", details: "you don't have access"})
    }
}