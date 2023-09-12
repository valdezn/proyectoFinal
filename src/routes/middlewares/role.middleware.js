export const roleMiddlewareAdmin = (req, res, next) => {
    if(req.user.user.role === 'admin'){
        next()
    }else{
        req.logger.error((`Error de autorización en el método ${req.method} en ${req.url}`))
        res.send({status: "error", details: "you don't have access"})
    }
}

export const roleMiddlewareUser = (req, res, next) => {
    if(req.user.user.role === 'user'){
        next()
    }else{
        req.logger.error((`Error de autorización en el método ${req.method} en ${req.url}`))
        res.send({status: "error", details: "you don't have access"})
    }
}

export const multipleRoles = (roles) => {
    return async (req, res, next) => {
      if (roles.includes(req.user.user.role)) {
        next();
      }
      else {
        req.logger.error((`Error de autorización en el método ${req.method} en ${req.url}`))
        res.send({status: "error", details: "you don't have access"})
      }
    }
}

export const roleMiddlewarePremium = (req, res, next) => {
    if(req.user.user.role === 'premium'){
        next()
    }else{
        req.logger.error((`Error de autorización en el método ${req.method} en ${req.url}`))
        res.send({status: "error", details: "you don't have access"})
    }
}