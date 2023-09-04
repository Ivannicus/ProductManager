import express from 'express';
const app = express()

// Improtamos Product Manager y creamos los 10 productos ocupando la función
import ProductManager from './ProductManager.js';
const PM = new ProductManager;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

(async () => {
    try {
        await PM.addProduct("Jabón", "Jabón marca Dove", "a1", 1300, true, 25, "Higiene", ["Sin imagen"]);
        await PM.addProduct("Shampoo", "Shampoo marca Head and Shoulders", "a2", 2500, true, 30, "Higiene", ["Sin imagen"]);
        await PM.addProduct("Pasta de Dientes", "Pasta dental marca Colgate", "a3", 2300, true, 12, "Higiene", ["Sin imagen"]);
        await PM.addProduct("Cepillo de Dientes", "Cepillo dental marca Colgate", "a4", 800, true, 23, "Higiene", ["Sin imagen"]);
        await PM.addProduct("Enjuague Bucal", "Enjuague marca Oral-B", "a5", 3500, true, 28, "Higiene", ["Sin imagen"]);
        await PM.addProduct("Hilo Dental", "Hilo dental marca Ahumada", "a6", 1850, true, 11, "Higiene", ["Sin imagen"]);
        await PM.addProduct("Esponja Corporal", "Esponja marca Líder", "a7", 350, true, 8, "Higiene", ["Sin imagen"]);
        await PM.addProduct("Bálsamo", "Balsamo cabello marca Tío Nacho", "a8", 4500, true, 24, "Higiene", ["Sin imagen"]);
        await PM.addProduct("Desodorante", "Desorante corporal marca Axe", "a9", 2500, true, 30, "Higiene", ["Sin imagen"]);
        await PM.addProduct("Crema Corporal", "Crema corporal marca Nutra", "a10", 6350, true, 45, "Higiene", ["Sin imagen"]);
    } catch (error){
        console.error(error)
    }
}) ();


app.listen(8080, () => {
    console.log('Servidor corriendo en el puerto 8080');
})