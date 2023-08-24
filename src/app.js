import express from 'express';
const app = express()

// Improtamos Product Manager y creamos los 10 productos ocupando la función
import ProductManager from './ProductManager.js';
const PM = new ProductManager;

(async () => {
    try {
        await PM.addProduct("Jabón", "Dove", "Sin imagen", 300, "abc123", 25);
        await PM.addProduct("Shampoo", "Head and Shoulders", "Sin imagen", 400, "abc124", 20);
        await PM.addProduct("Pasta de Dientes", "Colgate", "Sin imagen", 250, "abc125", 22);
        await PM.addProduct("Cepillo de Dientes", "Colgate", "Sin imagen", 100, "abc126", 35);
        await PM.addProduct("Enjuague Bucal", "Oral-B", "Sin imagen", 600, "abc127", 10);
        await PM.addProduct("Hilo Dental", "Ahumada", "Sin imagen", 220, "abc128", 27);
        await PM.addProduct("Esponja Corporal", "Líder", "Sin imagen", 150, "abc129", 15);
        await PM.addProduct("Bálsamo", "Tío Nacho", "Sin imagen", 500, "abc130", 11);
        await PM.addProduct("Desodorante", "Axe", "Sin imagen", 375, "abc131", 14);
        await PM.addProduct("Crema Corporal", "Nutra", "Sin imagen", 850, "abc132", 8);
    } catch (error){
        console.error(error)
    }
}) ();

// Definimos la obtención de productos ocupando la función del método PM y asignandole el límite por Query
app.get('/products', async (req, res) => {

    let productos = await PM.getProducts();

    let limit = req.query.limit;
    if(!limit){
        return res.send(productos);
    }
    productos.splice(parseInt(limit), productos.length - parseInt(limit));
    return res.send(productos);
})

// Obtenemos un objeto puntual ocupando la función getProductById de la clase Product Manager
app.get("/products/:pid", async(req, res) => {
    
    let idProducto = parseInt(req.params.pid);
    let producto = await PM.getProductById(idProducto);

    if (!producto) {
        return res.send(`El producto id: ${idProducto} no existe`);
    }
    res.send(producto);
})


app.listen(8080, () => {
    console.log('Servidor corriendo en el puerto 8080');
})