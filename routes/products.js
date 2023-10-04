import express from "express";
import { productsModel } from "../dao/models/products.model.js";
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));
import io from "../app.js";

router.get('/', async (req, res) => {
    try{
        const { limit = 10, page = 1, sort, query} = req.query;
        const { docs, totalDocs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate({}, {limit, page, lean:true, sort});
        const totalPages = Math.floor(totalDocs/limit)+1;

        if (hasPrevPage && hasNextPage){
            res.send({status: "Sucess", payload: docs, totalPages: totalPages, prevPage: prevPage, nextPage: nextPage, page: page, hasPrevPage: hasPrevPage, hasNextPage: hasNextPage, prevLink: `localhost8080/?page=${prevPage}&limit=${limit}`, nextLink: `localhost8080/?page=${nextPage}&limit=${limit}`})
        } else if (hasPrevPage) {
            res.send({status: "Sucess", payload: docs, totalPages: totalPages, prevPage: prevPage, nextPage: nextPage, page: page, hasPrevPage: hasPrevPage, hasNextPage: hasNextPage, prevLink: `localhost8080/?page=${prevPage}&limit=${limit}`, nextLink: null})
        } else if(hasNextPage) {
            res.send({status: "Sucess", payload: docs, totalPages: totalPages, prevPage: prevPage, nextPage: nextPage, page: page, hasPrevPage: hasPrevPage, hasNextPage: hasNextPage, prevLink: null, nextLink: `localhost8080/?page=${nextPage}&limit=${limit}`})
        } else {
            res.send({status: "Sucess", payload: docs, totalPages: totalPages, prevPage: prevPage, nextPage: nextPage, page: page, hasPrevPage: hasPrevPage, hasNextPage: hasNextPage, prevLink: null, nextLink: null})
        }
        

    } catch (error) {
        console.log(error.message);
        res.status(500).send({error: error.message})
    }
    
})

router.get("/:pid", async(req, res) => {  
    const idProduct = req.params.pid;
    try {
        const product = await productsModel.findOne({_id: idProduct});
        res.send({status: "Success", product: product});

        if (!product) {
            return res.status(400).send({status: "error", error: `The product id: ${idProduct} doesn't exist`});
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error: error.message})
    }
})

router.post('/', async (req, res) => {
        const { title, description, code, price, status, stock, category, thumbnails} = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
            return res.status(400).send({status: "error", error: 'You must fill all values'})
        }
        try {
            const product = await productsModel.create({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            });

            res.send({status: 'Sucess', product: product})
            const products = await productsModel.find().lean();
            io.emit('products', products); 
        } catch (error) {
            console.log(error.message);
            res.status(500).send({error: error.message})
        }
     
})

router.put('/:pid', async (req, res) => {
    const idProduct = req.params.pid;
    const productUpdated = req.body;

    if (!productUpdated.title || !productUpdated.description || !productUpdated.code || !productUpdated.price || !productUpdated.status || !productUpdated.stock || !productUpdated.category || !productUpdated.thumbnails) {
        return res.status(400).send({status: "error", error: 'You must fill all values'})
    }
    try{
        const updatedProduct = await productsModel.updateOne({_id: idProduct}, productUpdated);
        res.send({status: 'Sucess', product: updatedProduct});
        const products = await productsModel.find().lean();
        io.emit('products', products); 
    } catch(error) {
        console.log(error.message);
        res.status(500).send({error: error.message})
    }
})

router.delete('/:pid', async(req,res) => {

    const idProduct = req.params.pid;

    try{
        const deletedProduct = await productsModel.deleteOne({
            _id: idProduct
        })
        res.status(201).send({status: "Success", deletedProduct: deletedProduct});
        console.log(deletedProduct)
        const products = await productsModel.find().lean();
        io.emit('products', products);  
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error: error.message})
    }
})

export default router;