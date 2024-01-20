const fs = require("fs/promises")

class ProductManager {
	/**
     * Constructor de la clase.
     * @param {string} path - Ruta del archivo donde se almacenarán los productos.
     */
	constructor(path) {
		this.path = path;
		this.id = 1;
		this.productList = [];
	}

	/**
     * Asegura que el archivo exista, creándolo si es necesario.
     * @returns {Promise<void>}
     */
	async ensureFile() {
		console.log("Verificando archivo.");
		try {
			await fs.access(this.path);
			console.log("Archivo encontrado.");
		} catch (error) {
			console.log("Archivo inexistente.");
			await fs.writeFile(this.path, '{"products": []}', { encoding: 'utf-8' });
			console.log("Archivo creado.");
		}
	}

	/**
     * Verifica si un código de producto ya existe en la lista.
     * @param {string} code - Código a verificar.
     * @returns {Promise<boolean>} - Retorna true si el código no existe, false si ya existe.
     */
	async verifyCode(code) {
		try {
			const codeExists = this.productList.find(product => product.code === code);

			if (codeExists) {
				throw new Error("Code already exists.");
			}

			return true;
		} catch (error) {
			console.error("Error in code.");
			return false;
		}
	}

	/**
     * Verifica que todos los campos requeridos estén presentes.
     * @param {string} title - Título del producto.
     * @param {string} description - Descripción del producto.
     * @param {number} price - Precio del producto.
     * @param {string} thumbnail - URL de la imagen del producto.
     * @param {string} code - Código único del producto.
     * @param {number} stock - Cantidad de stock del producto.
     * @returns {boolean} - Retorna true si todos los campos están presentes, false si falta alguno.
     */
	verifyFields(title, description, price, thumbnail, code, stock) {
		try {
			const isValid = title && description && price && thumbnail && code && stock;
			if (!isValid) {
				throw new Error("All fields required.");
			}
			return true;
		} catch (error) {
			console.error("Error in fields.");
			return false;
		}
	}

	/**
     * Agrega un nuevo producto a la lista y al archivo.
     * @param {string} title - Título del producto.
     * @param {string} description - Descripción del producto.
     * @param {number} price - Precio del producto.
     * @param {string} thumbnail - URL de la imagen del producto.
     * @param {string} code - Código único del producto.
     * @param {number} stock - Cantidad de stock del producto.
     * @returns {Promise<void>}
     */
	async addProduct(title, description, price, thumbnail, code, stock) {
		if (!(await this.verifyCode(code))) {
			return;
		}

		if (!this.verifyFields(title, description, price, thumbnail, code, stock)) {
			return;
		}

		const product = {
			title, description, price, thumbnail, code, stock, id: this.id
		};
		this.id++;
		this.productList.push(product);

		await fs.writeFile(this.path, JSON.stringify({ products: this.productList }, null, 4), 'utf-8');
	}

	/**
     * Obtiene la lista actual de productos.
     * @returns {Promise<Array>} - Retorna un array con la lista de productos.
     */
	async getProducts() {
		try {
			const allProducts = await fs.readFile(this.path, 'utf-8');
			const parseObjects = JSON.parse(allProducts);
			console.log(parseObjects.products);
			return parseObjects.products
		} catch (error) {
			console.error("Parse error: ", error);
		}
	}

    /**
     * Obtiene un producto por su ID.
     * @param {number} id - ID del producto a buscar.
     * @returns {Promise<Object|null>} - Retorna el producto si se encuentra, o null si no existe.
     */
	async getProductById(id) {
		try {
			const allProducts = await fs.readFile(this.path, 'utf-8');
			const products = JSON.parse(allProducts).products;
			const findProduct = products.find((product) => product.id === id);

			if (!findProduct) {
				console.log("Product not found.");
			} else {
				console.log("Product found: ");
				console.log(typeof findProduct);
				console.log(findProduct);
			}

			return findProduct;
		} catch (error) {
			console.error("Error: ", error);
		}
	}

	/**
     * Actualiza un producto por su ID con nuevos campos.
     * @param {number} id - ID del producto a actualizar.
     * @param {Object} updatedFields - Campos actualizados del producto.
     * @returns {Promise<void>}
     */
	async updateProduct(id, updatedFields) {
		try {
			const index = this.productList.findIndex(product => product.id === id);
			if (index === -1) {
				console.log("Invalid ID.");
				return;
			}

			const updatedProduct = {
				...this.productList[index],
				...updatedFields,
				id: this.productList[index].id
			};

			this.productList[index] = updatedProduct;
			await fs.writeFile(this.path, JSON.stringify({ products: this.productList }, null, 4), 'utf-8');
			console.log("Product updated successfully: ", updatedProduct);
		} catch (error) {
			console.error("Error updating product: ", error);
		}
	}

    /**
     * Elimina un producto por su ID.
     * @param {number} id - ID del producto a eliminar.
     * @returns {Promise<void>}
     */
	async deleteProduct(id) {
		try {
			const index = this.productList.findIndex(product => product.id === id);

			if (index === -1) {
				console.log("Invalid ID.");
				return;
			}

			this.productList.splice(index, 1);

			await fs.writeFile(this.path, JSON.stringify({ products: this.productList }, null, 4), 'utf-8');
			console.log("Product deleted.");
		} catch (error) {
			console.error("Error: ", error);
		}
	}
}

module.exports = ProductManager
