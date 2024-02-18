const fs = require("fs/promises")
const Product = require('./models/ProductModel');

class ProductManager {
	constructor(path) {
	  this.path = path;
	  this.id = 1;
	  this.productList = [];
	  this.loadLastId();
	}
  
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
  
	async verifyCode(code) {
	  try {
		const codeExistsInMemory = this.productList.find((product) => product.code === code);
		if (codeExistsInMemory) {
		  throw new Error("Code already exists in memory.");
		}
  
		const currentContent = await fs.readFile(this.path, "utf-8");
		const productsData = JSON.parse(currentContent);
		const codeExistsInFile = productsData.products.find((product) => product.code === code);
  
		if (codeExistsInFile) {
		  throw new Error("Code already exists in file.");
		}
  
		return true;
	  } catch (error) {
		console.error("Error in code verification:", error.message);
		return false;
	  }
	}
  
	verifyFields(title, description, code, price, status, stock, category) {
	  try {
		const isValid = title && description && code && price && status && stock && category;
		if (!isValid) {
		  throw new Error("All fields required.");
		}
		return true;
	  } catch (error) {
		console.error("Error in fields.");
		return false;
	  }
	}
  
	async loadLastId() {
	  try {
		const currentContent = await fs.readFile(this.path, "utf-8");
		const productsData = JSON.parse(currentContent);
		const lastProduct = productsData.products[productsData.products.length - 1];
  
		if (lastProduct) {
		  this.id = lastProduct.id + 1;
		}
	  } catch (error) {
		console.error("Error loading last ID:", error);
	  }
	}
  
	async addProduct(title, description, code, price, status, stock, category, thumbnails) {
	  if (!(await this.verifyCode(code))) {
		return;
	  }
  
	  if (!this.verifyFields(title, description, code, price, status, stock, category, thumbnails)) {
		return;
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
		console.error("Error adding product:", error);
		return null;
	  }
	}
  
	async getProducts() {
	  try {
		const allProducts = await Product.find();
		return allProducts.map((product) => product.toJSON());
	  } catch (error) {
		console.error("Error getting products:", error);
		return [];
	  }
	}
  
	async getProductById(id) {
	  try {
		const product = await Product.findById(id);
		return product ? product.toJSON() : null;
	  } catch (error) {
		console.error("Error getting product by ID:", error);
		return null;
	  }
	}
  
	async updateProduct(id, updatedFields) {
	  try {
		const product = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
		if (!product) {
		  console.error("Invalid ID.");
		  return null;
		}
		return product.toJSON();
	  } catch (error) {
		console.error("Error updating product:", error);
		return null;
	  }
	}
  
	async deleteProduct(id) {
	  try {
		const product = await Product.findByIdAndDelete(id);
		if (!product) {
		  console.error("Invalid ID.");
		  return false;
		}
  
		const currentContent = await fs.readFile(this.path, "utf-8");
		let productsData = JSON.parse(currentContent);
		productsData.products = productsData.products.filter((product) => product.id !== id);
  
		await fs.writeFile(this.path, JSON.stringify(productsData, null, 4), "utf-8");
  
		return true;
	  } catch (error) {
		console.error("Error deleting product:", error);
		return false;
	  }
	}
  }
  
  module.exports = ProductManager;