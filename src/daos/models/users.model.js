import mongoose from 'mongoose'

const collection = 'users'

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    cartId: String,
    role: String,
    documents: [{
        name: String,
        reference: String
    }],
    last_connection: String  
})

const userModel = mongoose.model(collection, schema)
export default userModel