const fs = require("fs/promises")
const Product = require('./models/ProductModel');

class ProductManager {
    /**
     * Crea un nuevo gestor de productos.
     * @param {string} path
     */
    constructor(path) {
        this.path = path;
        this.id = 1; 
        this.productList = [];
        this.loadLastId();
    }

    /**
     * Verifica si el archivo de almacenamiento existe. Si no existe, lo crea con un formato inicial.
     */
    async ensureFile() {
        console.log("Verificando archivo.");
        try {
            await fs.access(this.path);
            console.log("Archivo encontrado.");
        } catch (error) {
            console.log("Archivo inexistente.");
            await fs.writeFile(this.path, '{"products": []}', { encoding: "utf-8" });
            console.log("Archivo creado.");
        }
    }

    /**
     * Verifica si un código de producto ya existe en memoria y en el archivo.
     * @param {string} code - Código del producto a verificar.
     * @returns {boolean} - Verdadero si el código no existe, falso si ya existe.
     */
    async verifyCode(code) {
        try {
            const codeExistsInMemory = this.productList.find((product) => product.code === code);
            if (codeExistsInMemory) {
                throw new Error("El código ya existe en memoria.");
            }

            const currentContent = await fs.readFile(this.path, "utf-8");
            const productsData = JSON.parse(currentContent);
            const codeExistsInFile = productsData.products.find((product) => product.code === code);

            if (codeExistsInFile) {
                throw new Error("El código ya existe en el archivo.");
            }

            return true;
        } catch (error) {
            console.error("Error en la verificación del código:", error.message);
            return false;
        }
    }

    /**
     * Verifica si todos los campos del producto son válidos.
     * @param {string} title - Título del producto.
     * @param {string} description - Descripción del producto.
     * @param {string} code - Código del producto.
     * @param {number} price - Precio del producto.
     * @param {boolean} status - Estado del producto.
     * @param {number} stock - Stock del producto.
     * @param {string} category - Categoría del producto.
     * @param {Array} thumbnails - Lista de miniaturas del producto.
     * @returns {boolean} - Verdadero si todos los campos son válidos, falso si falta algún campo.
     */
    verifyFields(title, description, code, price, status, stock, category, thumbnails) {
        try {
            const isValid = title && description && code && price && status && stock && category && thumbnails;
            if (!isValid) {
                throw new Error("Todos los campos son requeridos.");
            }
            return true;
        } catch (error) {
            console.error("Error en los campos:", error);
            return false;
        }
    }

    /**
     * Carga el último ID de producto del archivo de almacenamiento.
     */
    async loadLastId() {
        try {
            const currentContent = await fs.readFile(this.path, "utf-8");
            const productsData = JSON.parse(currentContent);
            const lastProduct = productsData.products[productsData.products.length - 1];

            if (lastProduct) {
                this.id = lastProduct.id + 1;
            }
        } catch (error) {
            console.error("Error cargando el último ID:", error);
        }
    }

    /**
     * Añade un nuevo producto al archivo de almacenamiento.
     * @returns {Object|null} - El nuevo producto creado o null si hubo un error.
     */
    async addProduct(title, description, code, price, status, stock, category, thumbnails) {
        if (!(await this.verifyCode(code))) {
            return null;
        }

        if (!this.verifyFields(title, description, code, price, status, stock, category, thumbnails)) {
            return null;
        }

        try {
            const newProduct = new Product({
                title,
                description,
                code,
                price,
                status: true,
                stock,
                category,
                thumbnails,
                id: this.id,
            });

            await newProduct.save();
            this.id++;

            const currentContent = await fs.readFile(this.path, "utf-8");
            let productsData = JSON.parse(currentContent);
            productsData.products.push(newProduct.toJSON());

            await fs.writeFile(this.path, JSON.stringify(productsData, null, 4), "utf-8");

            return newProduct.toJSON();
        } catch (error) {
            console.error("Error añadiendo producto:", error);
            return null;
        }
    }

    /**
     * Obtiene todos los productos almacenados.
     * @returns {Array} - Un array con todos los productos almacenados.
     */
    async getProducts() {
        try {
            const allProducts = await Product.find();
            return allProducts.map((product) => product.toJSON());
        } catch (error) {
            console.error("Error obteniendo productos:", error);
            return [];
        }
    }

    /**
     * Obtiene un producto por su ID.
     * @param {string} id - ID del producto a buscar.
     * @returns {Object|null} - El producto encontrado o null si no se encontró ningún producto con el ID proporcionado.
     */
    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            return product ? product.toJSON() : null;
        } catch (error) {
            console.error("Error obteniendo producto por ID:", error);
            return null;
        }
    }

    /**
     * Actualiza un producto existente.
     * @param {string} id - ID del producto a actualizar.
     * @param {Object} updatedFields - Campos actualizados del producto.
     * @returns {Object|null} - El producto actualizado o null si no se encontró ningún producto con el ID proporcionado.
     */
    async updateProduct(id, updatedFields) {
        try {
            const product = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
            if (!product) {
                console.error("ID inválido.");
                return null;
            }
            return product.toJSON();
        } catch (error) {
            console.error("Error actualizando producto:", error);
            return null;
        }
    }

    /**
     * Elimina un producto existente.
     * @param {string} id - ID del producto a eliminar.
     * @returns {boolean} - Verdadero si el producto se eliminó correctamente, falso si no se encontró ningún producto con el ID proporcionado.
     */
    async deleteProduct(id) {
        try {
            const product = await Product.findByIdAndDelete(id);
            if (!product) {
                console.error("ID inválido.");
                return false;
            }

            const currentContent = await fs.readFile(this.path, "utf-8");
            let productsData = JSON.parse(currentContent);
            productsData.products = productsData.products.filter((product) => product.id !== id);

            await fs.writeFile(this.path, JSON.stringify(productsData, null, 4), "utf-8");

            return true;
        } catch (error) {
            console.error("Error eliminando producto:", error);
            return false;
        }
    }
}

module.exports = ProductManager;
