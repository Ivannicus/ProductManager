import express from "express";
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));
import io from "../app.js";

import ProductManager from '../ProductManager.js';
const PM = new ProductManager;

router.get('/', async (req, res) => {
    const products = await PM.getProducts();
    const limit = req.query.limit;
    if (!products){
        return res.status(400).send({status: "Error", error: "No hay productos aún"})
    }
    if(!limit){
        return res.send({status: "Success", products: products});
    }
    products.splice(parseInt(limit), products.length - parseInt(limit));
    return res.send({status: "Success", products: products});
})

router.get("/:pid", async(req, res) => {  
    const idProduct = parseInt(req.params.pid);
    const product = await PM.getProductById(idProduct);
    if (!product) {
        return res.status(400).send({status: "error", error: `The product id: ${idProduct} doesn't exist`});
    }
    res.send({status: "Success", product: product});
})

router.post('/', async (req, res) => {
    const product = req.body;

    if (Object.keys(product).length < 8) {
        res.status(400).send({ status: "Error", error: "You must fill all the information to create a new product" })
    } else {
        if (Object.values(product).some(arg => arg === null || arg === "")) {
            res.status(400).send({status: "Error", error: "Empty or null arguments are not allowed"})
        } else{
            const answer = await PM.addProduct(product.title, product.description, product.code, product.price, product.status, product.stock, product.category, product.thumbnails);

            if (typeof answer === 'string') {
                res.status(400).send({ status: "error", error: answer })
            } else {              
                res.status(201).send({ status: "Product Created", product: answer});
                const products = await PM.getProducts();
                io.emit('products', products);               
            }
        }
    }
})

router.put('/:pid', async (req, res) => {
    const idProduct = parseInt(req.params.pid);
    const product = { id: idProduct, ...req.body };
    if (Object.keys(product).length < 9) {
        res.status(400).send({ status: "Error", error: "You must fill all the information to modify a product" })
    } else {
        const answer = await PM.updateProduct(product.id, product.title, product.description, product.code, product.price, product.status, product.stock, product.category, product.thumbnails);
        if (typeof answer === 'string') {
            res.status(400).send({ status: "Error", error: answer })
        } else {
            res.status(201).send({ status: "Success", modifiedProduct: answer })
            const products = await PM.getProducts();
            io.emit('products', products);  
        }
    }
})

router.delete('/:pid', async(req,res) => {
    const idProduct = parseInt(req.params.pid);
    const answer = await PM.deleteProduct(idProduct);
    if (typeof answer === 'string'){
        res.status(400).send({status: "error", error: answer})
    } else{
        res.status(201).send({status: "Success", deletedProduct: answer});
        const products = await PM.getProducts();
        io.emit('products', products);  
    }
    
})

export default router;