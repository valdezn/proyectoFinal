import mongoose from "mongoose";
import userModel from "../../models/users.model.js";

 
export default class UserManager{
    connection = mongoose.connect(process.env.MONGO_URL)

    getUser = async (email) => {
        const user = await userModel.find({'email': email}) 
        console.log(user)
        if (!user) return `Usuario no encontrado.`
        return user
    }

    getUsers = async (limit=10, page=1, sort=0, filter=null, filterVal=null) => {
        let whereOptions = {}
        if(filter != '' && filterVal != '') {
          whereOptions = {[filter]: filterVal}
        }  
        const result = await userModel.paginate(whereOptions, 
          {limit: limit, page: page, sort: {price: sort}, lean: true})
        
        return result
    }

    updateUser = async (email, userRole) => {
        const user = await this.getUser(email)
        if (user === process.env.ADMIN_EMAIL) {
            await userModel.findOneAndUpdate(
                {email: email},
                {$set: {role: 'admin'}}
            )
        } else {
            await userModel.findOneAndUpdate(
                {email: email},
                {$set: {role: userRole}}
            )
        }
    }

    updatePassword = async (email, newHashPassword) => {
        const user = await this.getUser(email)
        if (!user) return `Usuario no encontrado`
        await userModel.findOneAndUpdate(
                {email: email},
                {$set: {password: newHashPassword}}
        )
    }
}