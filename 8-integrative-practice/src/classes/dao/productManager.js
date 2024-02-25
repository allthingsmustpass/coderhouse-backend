const Product = require('./models/ProductModel');

class ProductManager {
    /**
     * Crea un nuevo gestor de productos.
     */
    constructor() {
        this.productList = [];
        this.id = 1;
    }

    /**
     * Verifica si ya existe un producto con el mismo código.
     */
    async checkDuplicateCode(code) {
        try {
            const existingProduct = await Product.findOne({ code });
            return existingProduct !== null;
        } catch (error) {
            console.error("Error verificando duplicado de código:", error);
            return true; // Considera que hay un error como precaución
        }
    }

    /**
     * Añade un nuevo producto.
     */
    async addProduct(title, description, code, price, status, stock, category, thumbnails) {
        try {
            if (await this.checkDuplicateCode(code)) {
                throw new Error("Ya existe un producto con el mismo código.");
            }
            
            if (!title || !description || !code || !price || !status || !stock || !category) {
                throw new Error("Todos los campos son requeridos excepto 'thumbnails'.");
            }

            const newProduct = new Product({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails,
                id: this.id
            });

            await newProduct.save();
            this.productList.push(newProduct);
            this.id++;

            return newProduct;
        } catch (error) {
            console.error("Error añadiendo producto:", error);
            return null;
        }
    }

    /**
     * Obtiene todos los productos almacenados.
     */
    async getProducts() {
        try {
            const products = await Product.find();
            return { products };
        } catch (error) {
            console.error("Error obteniendo productos:", error);
            return { products: [], total: 0 };
        }
    }

    /**
     * Obtiene un producto por su ID.
     */
    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            console.log(product)
            return product;
        } catch (error) {
            console.error("Error obteniendo producto por ID:", error);
            return null;
        }
    }

    /**
     * Actualiza un producto existente.
     */
    async updateProduct(id, updatedFields) {
        try {
            const product = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
            const index = this.productList.findIndex(product => product.id === id);
            if (index !== -1) {
                this.productList[index] = product;
            }
            return product;
        } catch (error) {
            console.error("Error actualizando producto:", error);
            return null;
        }
    }

    /**
     * Elimina un producto existente.
     */
    async deleteProduct(id) {
        try {
            await Product.findByIdAndDelete(id);
            this.productList = this.productList.filter(product => product.id !== id);
            return true;
        } catch (error) {
            console.error("Error eliminando producto:", error);
            return false;
        }
    }
}

module.exports = ProductManager;
