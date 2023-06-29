import mongoose, { Schema } from "mongoose";

const cartsCollection = 'carts'

const cartsSchema = new mongoose.Schema({
    products: {
      type: [
        {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "products"
            },
            quantity: {
              type: Number
            }
        }
    ]}
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)