import mongoose from "mongoose";
import userModel from "../../models/users.model.js";
import UserShortDTO from "../../../controllers/DTO/userShort.dto.js";

 
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
          {limit: limit, page: page, sort: {first_name: sort}, lean: true})
        
        const users = new UserShortDTO(result.docs)

        //console.log(users)
        return users
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

    deleteUsers = async (req, res) => {
        const usersDTO = await this.getUsers();
        const users = usersDTO.users;
        const currentTime = Date.now();
        var inactive = [];
      
        for (const user of users) {
            const lastConnection = user.last_connection;
      
            // Calcular el tiempo de inactividad en milisegundos
            const inactiveTime = currentTime - lastConnection;
      
            // Si el tiempo de inactividad supera un límite (por ejemplo, 30 minutos), considera al usuario inactivo
            const inactivityLimit = 30 * 60 * 1000; // 30 minutos en milisegundos
            //const inactivityLimit = 2 * 24 * 60 * 60 * 1000; // 2 días en milisegundos
    
            if (inactiveTime > inactivityLimit) {
                inactive.push(user.email);
            }
        }
        console.log(inactive)
        if (inactive.length > 0) {
            await userModel.deleteMany({ email: { $in: inactive } });
            return({status: "Success", details: `Se eliminaron ${inactive.length} usuario/s`});
        }

        for(email of inactive){
            let result = await transport.sendMail({
                from: "valdeznoelia26@gmail.com",
                to: email,
                subject: "Warning",
                html: `
                <div style='color:blue'>
                <h1>Su usuario hay sido eliminado por inactividad</h1>
                </div>`, ///el botón funciona sólo en pc
            });
            return result
        }
        res.send({status: "Success", details: "No hubo usuarios inactivos para eliminar"});
    }  
    
    deleteUser = async (req, res) => {
        const email = req.params.email
        await userModel.deleteOne({email: email})
        return({status: "Success", details: "Se ha eliminado un usaurio"});  
    }

    async editRole(req, res) {
        const email = req.params.email;
        const newRole = req.body.role;
        try {
            const user = await userModel.findOne({ email: email });
    
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            console.log(newRole)
            user.role = newRole;
            await user.save();
    
            res.render('editRole');
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el rol' });
        }
    }
    
    
}