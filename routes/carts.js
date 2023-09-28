import express from "express";
import { cartsModel } from "../dao/models/cart.model.js";
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get("/:cid", async (req, res) => {
    const idCart = req.params.cid;

    try{
        const cart = await cartsModel.findOne({_id: idCart});
        res.send({status: "Success", cart: cart});

        if (!cart) {
            return res.status(400).send({status: "error", error: `The cart id: ${idCart} doesn't exist`});
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error: error.message})
    }
})

router.post('/', async (req, res) => {
    try{
        const answer = await cartsModel.create({})
        res.status(201).send({status: "Success", message: answer});
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error: error.message})
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;

    try {
        const cart = await cartsModel.find({ _id: idCart });
        cart[0].products.push({ product: idProduct });
        await cartsModel.updateOne({_id: idCart}, cart);
        const cartUpdated = await cartsModel.find({ _id: idCart }).populate('products.product')
        res.status(201).send({status: "Success", payload: cartUpdated});
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: error.message })
    }
});

export default router;