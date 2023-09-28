const socket = io();

socket.on('products', products => {
    let productsHTML = document.getElementById("products");
    let listOfProducts = "";
    products.forEach(product => {
        listOfProducts = listOfProducts + `<li>${product.title} - ${product.description} - ${product.code} - ${product.price} - ${product.stock} - ${product.category}</li>`
    });
    productsHTML.innerHTML = listOfProducts;
})

