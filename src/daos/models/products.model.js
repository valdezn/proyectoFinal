import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = 'products'

const productsSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    thumbnail: {
        type: [String]
    },
    category: {
        type: String
    },
    code: {
        type: String
    },
    stock: {
        type: Number
    }
})

productsSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productsCollection, productsSchema)