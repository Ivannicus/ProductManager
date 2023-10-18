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
}

