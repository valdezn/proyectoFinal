export const roleMiddlewareAdmin = (req, res, next) => {
    if(req.user.user.role === 'admin'){
        next()
    }else{
        req.logger.error((`Error de autorización en el método ${req.method} de ${req.originalUrl}`))
        res.send({status: "error", details: "you don't have access"})
    }
}

export const roleMiddlewareUser = (req, res, next) => {
    if(req.user.user.role === 'user'){
        next()
    }else{
        req.logger.error((`Error de autorización en el método ${req.method} de ${req.originalUrl}`))
        res.send({status: "error", details: "you don't have access"})
    }
}

export const multipleRoles = (roles) => {
    return async (req, res, next) => {
      if (roles.includes(req.user.user.role)) {
        next();
      }
      else {
        req.logger.error((`Error de autorización en el método ${req.method} de ${req.originalUrl}`))
        res.send({status: "error", details: "you don't have access"})
      }
    }
}

export const roleMiddlewarePremium = (req, res, next) => {
    if(req.user.user.role === 'premium'){
        next()
    }else{
        req.logger.error((`Error de autorización en el método ${req.method} de ${req.originalUrl}`))
        res.send({status: "error", details: "you don't have access"})
    }
}

export const filesPremium = (req, res, next) => {
    const user = req.user.user.documents
    const userDocuments = JSON.stringify(user)
    const documents = req.user.user.documents.filter((document) => {
        //retorno todos los docs que haya en la carpeta profile
        return userDocuments.includes('profiles')
    })

    //console.log(userDocuments)
    if(documents.length < 3) {
        req.logger.error((`Error de autorización en el método ${req.method} de ${req.originalUrl}`))
        res.send({status: "error", details: "you don't complete documents"})
    }else{
        next()
    }
}