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
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        if (title, description, price, thumbnail, code, stock === "" || title, description, price, thumbnail, code, stock === undefined) {
            console.log("You must fill all the information to add a new product")
            return
        } else{
            try {
                const products = await fs.readFile(`${this.path}/products.json`, 'utf-8')
                this.#products = JSON.parse(products)
             
                if (this.#products.find(prod => prod['code'] === code) === undefined) {

                const createdProduct = {
                    id: Object.values(this.#products[this.#products.length - 1])[0] + 1,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                }
                this.#products.push(createdProduct)
                await fs.writeFile(`${this.path}/products.json`, JSON.stringify(this.#products, null, 2), 'utf-8');
                return
            } else {
                return
            }

        } catch(error) {
            try {
                const createdProduct = {
                    id: 1,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                }
                this.#products.push(createdProduct);
                await fs.writeFile(`${this.path}/products.json`, JSON.stringify(this.#products, null, 2), 'utf-8');
                console.log("Product name: ", title , " created sucessfully\n")
            } catch (error) {
                console.error(error)
            }
        }
    } 

}

    async getProducts() {
        try {
            let listJSON = await fs.readFile('./products.json', 'utf-8');
            this.#products = JSON.parse(listJSON);
            return this.#products
        } catch {
            console.log("There is no products on the list yet")
        }
    }
    async getProductById(id) {
        try { 
            let listJSON = await fs.readFile('./products.json', 'utf-8');
            this.#products = JSON.parse(listJSON);

            let searchedProduct = this.#products.find(prod => prod['id'] === id);

            if (searchedProduct !== undefined){
                return searchedProduct
            } else{
                return 
            }            
        } catch{
            console.log("There is no products on the list yet")
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
                console.log("The product id: ", id, " deleted successfully")
                return
            } else {
                console.log("There is no product to delete with the id: ", id)
            }
        }
        catch {
            console.log("There is no products on the list yet")
        }
    }

    async updateProduct(id,  title, description, price, thumbnail, code, stock){
        try {
            let listJSON = await fs.readFile('./products.json', 'utf-8');
            this.#products = JSON.parse(listJSON);

            if (title, description, price, thumbnail, code, stock === "" || title, description, price, thumbnail, code, stock === undefined) {
                console.log("You must fill all the information to add a new product")
                return
            } else {
                let productToUpdate = this.#products.find(prod => prod['id'] === id);
                if (productToUpdate !== undefined){
                    let index = this.#products.indexOf(productToUpdate)
                    this.#products.splice(index,1);
    
                    productToUpdate = {
                        id,
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock
                    }
    
                    this.#products.push(productToUpdate)
                    await fs.writeFile(`${this.path}/products.json`, JSON.stringify(this.#products, null, 2), 'utf-8');
                    console.log("Product id: ", id, " updated successfully");
                    return
                } else{
                    console.log("Product id: ", id, " is not on the list")
                }
 
            }
        }
        catch {
            console.log("There is no products on the list yet")
        }
    }
}


// const PM = new ProductManager;


