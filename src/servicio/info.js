export const generateErrorInfo = (product)=>{
    return `One or more properties were completed or invalid
    List of required properties:
    *name: needs to be a String, received "${product.name}",
    *description: needs to be a String, received "${product.description}",
    *price: needs to be a Number, received "${product.price}",
    *thumbnail: needs to be a [String], received "${product.thumbnail}",
    *category: needs to be a String, received "${product.category}",
    *code: needs to be a String, received "${product.code}",
    *stock: needs to be a Number, received "${product.stock}".`
}

