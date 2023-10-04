import express from 'express';
import { productsModel } from '../dao/models/products.model.js';
import io from "../app.js";
import { cartsModel } from '../dao/models/cart.model.js';

const router = express.Router();

router.get('/', async (req, res)=> {
    try{
        const { limit = 10, page = 1, sort, query} = req.query;



        const { docs, totalDocs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate({}, {limit, page, lean:true, sort});
  
        const products = docs;

        res.render('home', {
            products,
            totalDocs,
            hasNextPage,
            hasPrevPage,
            nextPage,
            prevPage,
            limit,
            sort
        });
    } catch (error){
        res.status(500).send({'error': error})
    }

});

router.get('/realtimeproducts', async (req, res)=> {
    
    res.render('realTimeProducts', {});
    const products = await productsModel.find().lean();
    io.emit('products', products); 
});

router.get('/chat', (req, res) => {
    res.render('chat', {});
});

router.get('/carts/:cid', async (req, res) => {
    const idCart = req.params.cid;


    const cart = await cartsModel.findOne({_id: idCart}).populate('products.product').lean();
    const products = cart.products;

    console.log(products);

    res.render('carts', {
        idCart,
        products
    })
})

export default router;