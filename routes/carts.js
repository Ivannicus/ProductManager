import express from "express";
import { cartsModel } from "../dao/models/cart.model.js";
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get("/:cid", async (req, res) => {
    const idCart = req.params.cid;

    try{
        const cart = await cartsModel.findOne({_id: idCart}).populate('products.product');
        res.send({status: "Success", cart: cart});

        if (!cart) {
            return res.status(400).send({status: "error", error: `The cart id: ${idCart} doesn't exist`});
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error: error.message})
    }
})

router.put("/:cid", async (req, res) => {
    try{
        const idCart = req.params.cid;
        const products = req.body;

        const cart = await cartsModel.updateOne({_id: idCart}, {products : products});

        res.status(201).send({status: "Success", payload: cart});

    } catch(error){
        console.log(error.message);
        res.status(500).send({error: error.message})
    }
})

router.delete("/:cid", async (req, res) => {
    try{
        const idCart = req.params.cid;
        const cart = await cartsModel.updateOne({_id: idCart}, {products : []});
        res.status(201).send({status: "Success", payload: cart});
    } catch(error){
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
        await cartsModel.updateOne({_id: idCart}, {products: cart[0].products});
        
        const cartUpdated = await cartsModel.find({ _id: idCart })
        res.status(201).send({status: "Success", payload: cartUpdated});
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: error.message })
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    try {
        const cart = await cartsModel.updateOne({_id: idCart}, {$pull: {products : {product: idProduct}}});
        res.status(201).send({status: "Success", payload: cart});
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: error.message })
    }

});

router.put('/:cid/products/:pid', async (req, res) => {
    //Deberá poder actualizar SOLO la cantidad de ejemplares el producto por cualquier cantidad pasada desde req.body
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const quantity = req.body;

    try {
        const cart = await cartsModel.find({ _id: idCart });

        console.log(cart);
        // const currentQuantity = await cartsModel.aggregate(
        //     [
        //         {
        //             $match: {_id: idCart}
        //         },
        //         {
        //             $match: {products: {product: idProduct}}
        //         }
        //     ]
        // );
        // console.log(currentQuantity)
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: error.message })
    }

});





export default router;