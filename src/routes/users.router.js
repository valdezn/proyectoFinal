import { Router } from "express";
import passport from "passport";
import sessionController from "../controllers/session.controller.js";
import UsersController from "../controllers/users.controller.js"
import { filesPremium } from "./middlewares/role.middleware.js";
import { multipleRoles } from "./middlewares/role.middleware.js";

const router = Router();
const userController = new UsersController()

router.get('/', async (req, res, next) => {
    await userController.getUsersController(req, res, next)
})

router.post('/premium/:uid', passport.authenticate('jwt', { session: false }), filesPremium, sessionController.updateUser);

router.get('/delete', passport.authenticate('jwt', {session: false}),
    multipleRoles(['admin']), async (req, res, next) => {
        await userController.deleteUsersController(req, res, next)
})

export default router