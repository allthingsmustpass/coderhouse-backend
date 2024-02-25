const express = require("express");
const router = express.Router();
const productManager = require("../classes/dao/ProductManager.js");
const pm = new productManager();
const Product = require('../classes/dao/models/ProductModel.js');

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || null;
    const query = req.query.query || null;
    let filter = {};

    if (query) {
      const [key, value] = query.split(":");
      filter[key] = value;
    }

    const allProducts = await pm.getProducts({ limit, page, sort, query });
    let responseProducts = allProducts.products;

    if (limit && limit > 0) {
      responseProducts = responseProducts.slice(0, limit);
    }

    if (query) {
      responseProducts = await Product.find(filter);
    }

    const cleanProducts = responseProducts.map(product => {
      return {
        title: product.title,
        description: product.description,
        price: product.price,
        status: product.status,
        stock: product.stock,
        category: product.category,
        thumbnail: product.thumbnail
      };
    });

    res.render("productsindex", {
      status: "success",
      products: cleanProducts,
      totalPages: allProducts.totalPages,
      prevPage: allProducts.prevPage,
      nextPage: allProducts.nextPage,
      page: allProducts.page,
      hasPrevPage: allProducts.hasPrevPage,
      hasNextPage: allProducts.hasNextPage,
      prevLink: allProducts.hasPrevPage ? `/api/products?limit=${limit}&page=${allProducts.prevPage}&sort=${sort}&query=${query}` : null,
      nextLink: allProducts.hasNextPage ? `/api/products?limit=${limit}&page=${allProducts.nextPage}&sort=${sort}&query=${query}` : null
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const searchId = await pm.getProductById(id);

    if (searchId) {
      const cleanProduct = {
        title: searchId.title,
        description: searchId.description,
        price: searchId.price,
        status: searchId.status,
        stock: searchId.stock,
        category: searchId.category,
        thumbnail: searchId.thumbnail
      };
  
      res.render('product', { product: cleanProduct });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const newProduct = await pm.addProduct(title, description, code, price, status, stock, category, thumbnails);
    return res.json(newProduct);
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const searchId = await pm.getProductById(id);

    if (searchId) {
      const { title, description, code, price, status, stock, category, thumbnails } = req.body;
      await pm.updateProduct(id, { title, description, code, price, status, stock, category, thumbnails });
      return res.json({ message: "Product updated successfully" });
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await pm.deleteProduct(id);
    return res.json({ message: "Product deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
