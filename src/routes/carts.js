import express from "express";
import { uploader } from "../utils.js";
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));

import ProductManager from '../ProductManager.js';
const PM = new ProductManager;

router.get("/:cid", async (req, res) => {
    const idCart = parseInt(req.params.cid);
    const cart = await PM.getCartsById(idCart);
    if (typeof cart === 'string') {
        return res.status(400).send({ status: "error", error: cart });
    } else {
        res.send({status: "Success", cart: cart});
    }
})

router.post('/', async (req, res) => {
    const answer = await PM.createCart();
    res.status(201).send({status: "Success", message: answer});
})

router.post('/:cid/product/:pid', async (req, res) => {
    let idCart = parseInt(req.params.cid);
    let idProduct = parseInt(req.params.pid);
    const modifiedCart = await PM.addProductsToCart(idCart, idProduct);
    if (typeof modifiedCart === 'string'){
        res.status(400).send({status: "error", error: modifiedCart})
    } else{
        res.status(201).send({status: "Success", modifiedCart: modifiedCart});
    }
    
})



export default router;