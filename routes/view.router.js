import express from 'express';
import { productsModel } from '../dao/models/products.model.js';
import io from "../app.js";
import { cartsModel } from '../dao/models/cart.model.js';

const router = express.Router();

router.get('/', async (req, res)=> {
    try{
        const { limit = 10, page = 1, sort, query = false} = req.query;


        

        
        let sortType = 0;
        if (sort === "asc"){
            sortType = 1
        };
        if (sort === "desc"){
            sortType = -1
        }
        
        if (query) {
            const objQuery = JSON.parse('{'+query+'}');
            const { docs, totalDocs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate(objQuery, {limit, page, lean:true, sort: {price: sortType}});
            const products = docs;
            res.render('home', {
                products,
                totalDocs,
                hasNextPage,
                hasPrevPage,
                nextPage,
                prevPage,
                limit,
                sort,
                query
            });
        } else {
            const { docs, totalDocs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate({}, {limit, page, lean:true, sort: {price: sortType}});
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
        }

    } catch (error){
        res.status(500).send({'error': error})
    }

});

router.get('/realtimeproducts', async (req, res)=> {
    
    res.render('realTimeProducts', {});
    const products = await productsModel.find().lean();
    // res.render('realTimeProducts',{});
    io.emit('products', products); 
    
});

router.get('/chat', (req, res) => {
    res.render('chat', {});
});

router.get('/carts/:cid', async (req, res) => {
    const idCart = req.params.cid;


    const cart = await cartsModel.findOne({_id: idCart}).populate('products.product').lean();
    const products = cart.products;


    res.render('carts', {
        idCart,
        products
    })
});

router.get('/products', async (req, res)=> {
    try{
        const { limit = 10, page = 1, sort, query} = req.query;

        const objQuery = JSON.parse('{'+query+'}')
      
        const { docs, totalDocs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate(objQuery, {limit, page, lean:true});
  
        const products = docs;

        res.render('products', {
            products,
            totalDocs,
            hasNextPage,
            hasPrevPage,
            nextPage,
            prevPage,
            limit,
            sort,
            query
        });
    } catch (error){
        res.status(500).send({'error': error})
    }
});

router.get('/products/:pid', async (req, res)=> {
    try{
        const idProduct = req.params.pid;
        const product = await productsModel.findOne({_id: idProduct}).lean();
        res.render('product', {
            idProduct,
            product
        });
    } catch (error){
        res.status(500).send({'error': error})
    }

});

export default router;