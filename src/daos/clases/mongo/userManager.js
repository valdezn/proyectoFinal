import mongoose from "mongoose";
import userModel from "../../models/users.model.js";


export default class UserManager{
    connection = mongoose.connect(process.env.MONGO_URL)

    getUser = async (email) => {
        const user = await userModel.find({'email': email})
        if (!user) return `Usuario no encontrado.`
        return user
    }

    updateUser = async (email) => {
        const user = await this.getUser(email)
        if (user === process.env.ADMIN_EMAIL) {
            await userModel.findOneAndUpdate(
                {email: email},
                {$set: {role: 'admin'}}
            )
        } else {
            await userModel.findOneAndUpdate(
                {email: email},
                {$set: {role: 'usuario'}}
            )
        }
    }
}