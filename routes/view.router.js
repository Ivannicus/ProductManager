import express from 'express';
import ProductManager from '../ProductManager.js';

const router = express.Router();
const PM = new ProductManager;

router.get('/', async (req, res)=> {
    const products = await PM.getProducts();
    res.render('home', {
        products: products
    });
})

router.get('/realtimeproducts', async (req, res)=> {
    res.render('realTimeProducts', {});
})


export default router;