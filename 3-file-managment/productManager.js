const fs = require("fs");
const { parse } = require("path");

class ProductManager {

	constructor(path) {
			this.path = path
			this.id = 1
			this.ensureFile()
			this.productList = []
	}

	ensureFile() {
			console.log("Verificando archivo.")
			try {
					fs.accessSync(this.path)
					console.log("Archivo encontrado.")
			} catch (error) {
					console.log("Archivo inexistente.")
					fs.writeFileSync(this.path, '{"products": []}', { encoding: 'utf-8' })
					console.log("Archivo creado.")
			}
	}

	verifyCode(code) {
			try {
					const codeExists = this.productList.find(product => product.code === code)

					if (codeExists) {
							throw new Error("Code already exists.")
					}

					return true
			} catch (error) {
					console.error("Error in code.")
					return false
			}
	}

	verifyFields(title, description, price, thumbnail, code, stock) {
			try {
					const isValid = title && description && price && thumbnail && code && stock
					if (!isValid) {
							throw new Error("All fields required.")
					}
					return true
			} catch (error) {
					console.error("Error in fields.")
					return false
			}
	}

	addProduct(title, description, price, thumbnail, code, stock) {
			if (!this.verifyCode(code)) {
					return
			}

			if (!this.verifyFields(title, description, price, thumbnail, code, stock)) {
					return
			}

			const product = {
					title, description, price, thumbnail, code, stock, id: this.id
			}
			this.id++
			this.productList.push(product)
			fs.writeFileSync(this.path, JSON.stringify({ products: this.productList }, null, 4), 'utf-8')
	}

	getProducts = () => {
			try {
					const allProducts = fs.readFileSync(this.path)
					const parseObjects = JSON.parse(allProducts)
					console.log(parseObjects.products)
					return this.productList
			} catch (error) {
					console.error("Parse error: ", error)
			}
	}

	getProductById(id) {
			const allProducts = fs.readFileSync(this.path, 'utf-8')
			const products = JSON.parse(allProducts).products
			const findProduct = products.find((product) => product.id === id)

			try {
				
					if (!findProduct) {
							console.log("Product not found.")
					} else {
							console.log("Product found: ")
							console.log(typeof findProduct)
							console.log(findProduct)
					}

			} catch (error) {
					console.error("Error: ", error)
			}
			return findProduct
	}

	updateProduct(id, updatedFields) {
			try {
					const index = this.productList.findIndex(product => product.id === id)
					if (index === -1) {
							console.log("Invalid ID.")
							return;
					}

					const updatedProduct = {
							...this.productList[index],
							...updatedFields,
							id: this.productList[index].id
					};

					this.productList[index] = updatedProduct;
					fs.writeFileSync(this.path, JSON.stringify({ products: this.productList }, null, 4), 'utf-8')
					console.log("Product updated successfully: ",updatedProduct)
			} catch (error) {
				console.error("Error updating product: ", error)
			}
	}

	deleteProduct(id) {
		try {
				const index = this.productList.findIndex(product => product.id === id)

				if (index === -1) {
						console.log("Invalid ID.")
						return;
				}

				this.productList.splice(index, 1)

				fs.writeFileSync(this.path, JSON.stringify({ products: this.productList }, null, 4), 'utf-8')
				console.log("Product deleted.")
		} catch (error) {
				console.error("Error: ", error)
		}
	}
}

//Crea una instancia de la clase “ProductManager”.
const productManager = new ProductManager('products.json')

//Se llama “getProducts” ya creada la instancia, retornando un arreglo vacío.
productManager.getProducts()

// Crea el objeto con un ID automáticamente sin repetirse.
productManager.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25)

// Llama a “getProducts” y retorna el objeto.
productManager.getProducts()

//Llama a "getProductById" y devuelve el producto con el id especificado.
productManager.getProductById(1)

//Llama a "getProductById" y devuelve un id inexistente, arrojando un error.
productManager.getProductById(2)

//Llama a “updateProduct” intentando cambiar un campo, sin eliminar el id y efectivamente actualizando. 
productManager.updateProduct(1, { title: 'producto prueba actualizado', price: 300, stock: 50 });

//Llama a “deleteProduct”, eliminando el producto.
productManager.deleteProduct(1)

//Llama a “deleteProduct”, eliminando un producto inexistente, arrojando error.
productManager.deleteProduct(2)