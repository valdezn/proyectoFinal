import { Router } from "express";
import { roleMiddlewareUser } from "./middlewares/role.middleware.js";
import ChatManager from "../daos/clases/mongo/chatManager.js";
import passport from "passport";

const router = new Router();
const chatManager = new ChatManager()


router.get('/', passport.authenticate('jwt', { session: false }), roleMiddlewareUser, (req, res) => {
    res.render('chat.handlebars')
})

router.post('/', (req, res) => {
    chatManager.messagesSave()
})

export default router