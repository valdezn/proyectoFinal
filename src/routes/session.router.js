import { Router } from "express";
import userModel from "../daos/models/users.model.js";
import UserManager from "../daos/clases/mongo/userManager.js";

const users = new UserManager();
const router = Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body; //recibe el registro
  const exist = await userModel.findOne({ email }); //verifico si existe

  if (exist)
    return res
      .status(400)
      .send({ status: "error", message: "usuario ya registrado" });

  let result = await userModel.create({
    first_name,
    last_name,
    email,
    age,
    password,
  });
  await users.updateUser(email)

  res.send({ status: "success", message: "usuario  registrado" });
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email, password: password });
  console.log(user);

  if (!user) return res.redirect('/api/login');

  if (user) {
    const userName = {name: user.first_name, last_name: user.last_name, email: user.email}
    req.session.userName = userName; // Guardo el nombre de usuario en la sesión
    if (email === 'adminCoder@coder.com' || password === 'adminCod3r123') {
      req.session.admin = true
    } else {
      req.session.admin = false
    }
  res.redirect('/products');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.json({status: 'Logout Error, body: err'})
    }
  res.redirect('/login');
  })
})

export default router