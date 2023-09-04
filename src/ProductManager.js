import fs from 'fs/promises'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default class ProductManager {
    
    #products
    constructor() {
        this.path = __dirname;
        this.#products = [];
        this.carts = [];
    }

    async addProduct(title, description, code, price, status, stock, category, thumbnail) {
        try {
            const products = await fs.readFile(`${this.path}/products.json`, 'utf-8')
            this.#products = JSON.parse(products)

            if (this.#products.find(prod => prod['code'] === code) === undefined) {

                const createdProduct = {
                    id: Object.values(this.#products[this.#products.length - 1])[0] + 1,
                    title,
                    description,
                    code,
                    price,
                    status,
                    stock,
                    category,
                    thumbnail,
                }
                this.#products.push(createdProduct)
                await fs.writeFile(`${this.path}/products.json`, JSON.stringify(this.#products, null, 2), 'utf-8');
                return createdProduct
            } else {
                return (`The product code ${code} already exists`)
            }

        } catch {

            const createdProduct = {
                id: 1,
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail,
            }
            this.#products.push(createdProduct);
            await fs.writeFile(`${this.path}/products.json`, JSON.stringify(this.#products, null, 2), 'utf-8');
            return createdProduct
        }

    }

    async getProducts() {
        try {
            let listJSON = await fs.readFile('./products.json', 'utf-8');
            this.#products = JSON.parse(listJSON);
            return this.#products
        } catch {
            return
        }
    }
    async getProductById(id) {
        try { 
            let listJSON = await fs.readFile('./products.json', 'utf-8');
            this.#products = JSON.parse(listJSON);
            let searchedProduct = this.#products.find(prod => prod['id'] === id);
            return searchedProduct   
        } catch{
            return
        }
    }

    async deleteProduct(id) {
        try {
            let listJSON = await fs.readFile('./products.json', 'utf-8');
            this.#products = JSON.parse(listJSON);

            let deletedProduct = this.#products.find(prod => prod['id'] === id);
            let index = this.#products.indexOf(deletedProduct)

            if (deletedProduct !== undefined){
                this.#products.splice(index,1);
                await fs.writeFile(`${this.path}/products.json`, JSON.stringify(this.#products, null, 2), 'utf-8');
                return deletedProduct
            } else {
                return `There is no product to delete with the id: ${id}`
            }
        }
        catch {
            return "There is no products on the list yet"
        }
    }

    async updateProduct(id, title, description, code, price, status, stock, category, thumbnail){
        try {
            let listJSON = await fs.readFile('./products.json', 'utf-8');
            this.#products = JSON.parse(listJSON);

                let productToUpdate = this.#products.find(prod => prod['id'] === id);
                if (productToUpdate !== undefined){
                    let index = this.#products.indexOf(productToUpdate)
                    this.#products.splice(index,1);
    
                    productToUpdate = {
                        id,
                        title,
                        description,
                        code,
                        price,
                        status,
                        stock,
                        category,
                        thumbnail,
                    }
    
                    this.#products.push(productToUpdate)
                    await fs.writeFile(`${this.path}/products.json`, JSON.stringify(this.#products, null, 2), 'utf-8');
                    return productToUpdate
                } else{
                    return `Product id: ${id} is not on the list`
                }
 
            
        }
        catch {
           return "There is no products on the list yet"
        }
    }

    async createCart() {

        try {
            const carts = await fs.readFile(`${this.path}/carts.json`, 'utf-8')
            this.carts = JSON.parse(carts)
            const newCart = {
                id: this.carts.length + 1,
                products: []
            }
            this.carts.push(newCart);
            await fs.writeFile(`${this.path}/carts.json`, JSON.stringify(this.carts, null, 2), 'utf-8');
            return `New cart created. Cart id: ${newCart.id}`

        } catch {
            const newCart = {
                id: 1,
                products: []
            }
            this.carts.push(newCart);
            await fs.writeFile(`${this.path}/carts.json`, JSON.stringify(this.carts, null, 2), 'utf-8');
            return `New cart created. Cart id: ${newCart.id}`
        }

    }

    async getCartsById(id) {
        try { 
            let cartsJSON = await fs.readFile('./carts.json', 'utf-8');

            this.carts = JSON.parse(cartsJSON);

            let searchedCart = this.carts.find(cart => cart['id'] === id);

            if (searchedCart !== undefined){
                return searchedCart
            } else{
                return `The cart id: ${id} doesn't exist`
            }            
        } catch{
            return "There are no carts created yet"
        }
    }

    async addProductsToCart(idCart, idProduct) {
        try { 
            let cartsJSON = await fs.readFile('./carts.json', 'utf-8');
            let productsJSON = await fs.readFile('./products.json', 'utf-8');

            this.#products = JSON.parse(productsJSON);
            this.carts = JSON.parse(cartsJSON);

            let searchedProduct = this.#products.find(prod => prod['id'] === idProduct);
            let searchedCart = this.carts.find(cart => cart['id'] === idCart);
            let cartIndex = this.carts.findIndex(cart => cart['id'] === idCart);

            
            if (cartIndex !== -1 && searchedProduct !== undefined){
                this.carts.splice(cartIndex,1);
                let indexProdinCart = searchedCart.products.findIndex(prod => prod['id'] === idProduct);

                if (indexProdinCart === -1){
                    searchedCart.products.push(
                        {
                            id: idProduct,
                            quantity: 1,
                        }
                    )
                    
                    this.carts.push(searchedCart)
                    await fs.writeFile(`${this.path}/carts.json`, JSON.stringify(this.carts, null, 2), 'utf-8');
                    return searchedCart

                } else{
                    searchedCart.products[indexProdinCart].quantity ++;
                    this.carts.push(searchedCart)
                    await fs.writeFile(`${this.path}/carts.json`, JSON.stringify(this.carts, null, 2), 'utf-8');
                    return searchedCart
                }
            } else{
                if (cartIndex === -1 && searchedProduct === undefined){
                    return `Both IDs are incorrect (idCart = ${idCart}, idProduct = ${idProduct})`
                } else if (cartIndex === -1){
                    return `Cart ID: ${idCart} doesn't exists`
                } else {
                    return `Product ID: ${idProduct} doesn't exists`
                }
            }            
        } catch{
            return "There is no products on the list yet"
        }
    }
}


// const PM = new ProductManager;


