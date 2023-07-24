import { Router } from "express";
import userModel from "../daos/models/users.model.js";
import UserManager from "../daos/clases/mongo/userManager.js";
import bcrypt from 'bcrypt';
import passport from "passport";
import jwt from "jsonwebtoken";
import CartManager from "../daos/clases/mongo/cartsManager.js";
import initializePassport from "../config/passport.config.js";

const cartsManager = new CartManager()
const users = new UserManager();
const router = Router();

router.post("/register",  passport.authenticate('register', {session: false}), async (req, res) => {
  res.send({ status: "success", message: "usuario  registrado" });
});


router.post('/login', passport.authenticate('login', {session: false}), async (req, res) => {
  let token = jwt.sign({email: req.body.email}, "coderSecret", {
    expiresIn: "24h",
  });

  const user = req.user; // Accedo al usuario autenticado desde req.user
  
  const passwordMatch = bcrypt.compare(req.body.password, user.password);
  if (!passwordMatch) return res.redirect('/api/login');
  
  res
  .cookie("coderCookie", token, {httpOnly: true})
  .redirect('/products');
});

router.get('/current', passport.authenticate('jwt', {session: false}), (req,res) => {
  res.send(req.user);
});


router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login'); 
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {});

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res)=>{
  console.log('Success')
  const user = req.user
  
  const userName = {
    name: user.first_name,
    last_name: user.last_name,
    email: user.email
  };
  req.session.userName = userName;

  if (user.email === 'adminCoder@coder.com') {
    req.session.admin = true;
  } else {
    req.session.admin = false;
  }

  res.redirect('/products')
} )

export default router