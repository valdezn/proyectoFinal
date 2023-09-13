import { Router } from "express";
import passport from "passport";
import sessionController from "../controllers/session.controller.js";
import { multipleRoles } from "./middlewares/role.middleware.js";


const router = Router();


router.post('/register', passport.authenticate('register', { session: false }), sessionController.registerUser);

router.post('/login', passport.authenticate('login', { session: false }), sessionController.loginUser);

router.get('/current', passport.authenticate('jwt', { session: false }), sessionController.getCurrentUser);

router.get('/logout', sessionController.logoutUser);

router.post('/resetPassword', passport.authenticate('jwtRequestPassword', { session: false , failureRedirect: '/requestResetPassword'}), sessionController.resetPassword);

router.post('/requestResetPassword', sessionController.requestResetPassword);

router.get('/premium/', passport.authenticate('jwt', { session: false }), multipleRoles(['admin']), sessionController.updateUser);


router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {});
//EN REVISIÓN
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res)=>{
  console.log('Success')
  const user = req.user
  
  const userName = {
    name: user.first_name,
    last_name: user.last_name,
    email: user.email
  };
  req.session.userName = userName;

  if (user.email === process.env.ADMIN_EMAIL) {
    req.session.admin = true;
  } else {
    req.session.admin = false;
  

  res.redirect('/products')
  }
})

export default router