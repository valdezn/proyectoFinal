import { Router } from "express";
import { generateProducts } from "../utils.js";

const router = Router();

router.get('/', async (req, res) => {
    let products = [];
    for (let i = 0; i < 51; i++) {
      products.push(generateProducts());
    }
    res.send({payload: products})
})

export default router;