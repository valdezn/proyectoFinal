import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserManager from '../daos/clases/mongo/userManager.js';
import CartManager from '../daos/clases/mongo/cartsManager.js';
import UserDTO from './DTO/user.dto.js';
import nodemailer from 'nodemailer';
import { createHash } from '../utils.js';

const cartsManager = new CartManager();
const users = new UserManager();

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.EMAIL_PASS
  },
});

const registerUser = async (req, res) => {
  res.send({ status: 'success', message: 'usuario registrado' });
};

const loginUser = async (req, res) => {
    let token = jwt.sign({user: req.user}, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
    
      const user = req.user; // Accedo al usuario autenticado desde req.user
      //console.log(user)
      
      const passwordMatch = bcrypt.compare(req.body.password, user.password);
      if (!passwordMatch) return res.status(400).send({status: "error", details: "Credenciales incorrectas"})
      
      res
      .cookie("coderCookie", token, {httpOnly: true})
      .send({status: "success"})
}

const getCurrentUser = async (req, res) => {
  const result = new UserDTO(req.user)
  console.log(req.user)
  res.send(result);
};

const authorized = async (req, res) => {
  const user = req.user;
  if (user.role === 'user') return res.redirect('/api/login');
}

const resetPassword = async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).send({status: "error", error: "Incomplete credentials"})
  }

  try{
    const newHashPassword = createHash(password);

    await users.updatePassword(email, newHashPassword)
    //console.log('hola')
    return res.send({status: "success", message: "Password updated"})
  } catch (e) {
    return res.status(400).send({status: "error", error: e.message})
  }
}

const requestResetPassword = async (req, res) => {
  const {email} = req.body;
  //console.log(email)
  const user = await users.getUser(email)
  
  if (!email) {
    return res.status(400).send({status: "error", error: "Incomplete credentials"})
  }
  //console.log(user)
  if (user === `Usuario no encontrado.`) return `Usuario no encontrado`
  try{
    
    let token = jwt.sign({email}, process.env.JWT_SECRET_RESET, {expiresIn: '1h'})

    let result = await transport.sendMail({
      from: "valdeznoelia26@gmail.com",
      to: email,
      subject: "correo de recuperación",
      html: `
        <div style='color:blue'>
          <h1>Reestablezca su contraseña</h1>
          <a href="http://localhost:8080/resetPassword?token=${token}"><button id="restart">Restart</button></a> 
        </div>`, 
      });
      console.log(`en el try`)
    return res.send({status: "success", message: "Password updated"})
  } catch (e) {
    return res.status(400).send({status: "error", error: e.message})
  }
}

const updateUser = async (req, res) => {
  const {email, role} = req.body;
  //const userId = req.params.uid
  if (!email || !role) {
    return res.status(400).send({status: "error", error: "Incomplete credentials"})
  }
  await users.updateUser(email, role)
  return res.send({status: "success", message: "Role updated"})
}

const logoutUser = (req, res) => {
  res.clearCookie('coderCookie');
  res.redirect('/login');
};

export default {loginUser, registerUser, logoutUser, getCurrentUser, authorized, resetPassword, requestResetPassword, updateUser}