import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserManager from '../daos/clases/mongo/userManager.js';
import CartManager from '../daos/clases/mongo/cartsManager.js';

const cartsManager = new CartManager();
const users = new UserManager();

const registerUser = async (req, res) => {
  res.send({ status: 'success', message: 'usuario registrado' });
};

const loginUser = async (req, res) => {
    let token = jwt.sign({email: req.body.email}, "coderSecret", {
        expiresIn: "24h",
      });
    
      const user = req.user; // Accedo al usuario autenticado desde req.user
      //console.log(user)
      
      const passwordMatch = bcrypt.compare(req.body.password, user.password);
      if (!passwordMatch) return res.redirect('/api/login');
      
      res
      .cookie("coderCookie", token, {httpOnly: true})
      .redirect('/products');
}

const getCurrentUser = (req, res) => {
  res.send(req.user);
};

const logoutUser = (req, res) => {
  res.clearCookie('coderCookie');
  res.redirect('/login');
};

export default {loginUser, registerUser, logoutUser, getCurrentUser}

