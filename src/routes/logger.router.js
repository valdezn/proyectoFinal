import { Router } from "express";

const router = Router();

router.get('/', async (req, res) => {
    req.logger.fatal("Test de Logger - Level: 'fatal'")
    req.logger.error("Test de Logger - Level: 'error'")
    req.logger.warning("Test de Logger - Level: 'warning'")
    req.logger.info("Test de Logger - Level: 'info'")
    req.logger.http("Test de Logger - Level: 'http'")
    req.logger.debug("Test de Logger - Level: 'debug'")
  
    res.send("Test finalizado")
})

export default router