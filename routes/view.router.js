import express from 'express';
import { productsModel } from '../dao/models/products.model.js';
import io from "../app.js";

const router = express.Router();

router.get('/', async (req, res)=> {
    try{
        const { limit = 10, page = 1, sort, query} = req.query;

        console.log(limit, page, sort, query)


        const { docs, totalDocs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate({}, {limit, page, lean:true, sort});
        
        const products = docs;
        console.log(products);

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