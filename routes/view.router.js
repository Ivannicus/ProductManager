import express from 'express';
import { productsModel } from '../dao/models/products.model.js';
import io from "../app.js";

const router = express.Router();

router.get('/', async (req, res)=> {
    try{
        const products = await productsModel.find().lean();
        res.render('home', {
            products: products
        });
    } catch (error){
        res.status(500).send({'error': error})
    }

})

router.get('/realtimeproducts', async (req, res)=> {
    
    res.render('realTimeProducts', {});
    const products = await productsModel.find().lean();
    io.emit('products', products); 
})

router.get('/chat', (req, res) => {
    res.render('chat', {});
})


export default router;