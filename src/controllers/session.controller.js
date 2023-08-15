import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserManager from '../daos/clases/mongo/userManager.js';
import CartManager from '../daos/clases/mongo/cartsManager.js';
import UserDTO from './DTO/user.dto.js';

const cartsManager = new CartManager();
const users = new UserManager();

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
  //console.log(req.user)
  res.send(result);
};

const authorized = async (req, res) => {
  const user = req.user;
  if (user.role === 'user') return res.redirect('/api/login');
}

const logoutUser = (req, res) => {
  res.clearCookie('coderCookie');
  res.redirect('/login');
};

export default {loginUser, registerUser, logoutUser, getCurrentUser, authorized}

