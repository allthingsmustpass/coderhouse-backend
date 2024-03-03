const express = require("express");
const router = express.Router();
const productManager = require("../classes/dao/productManager.js");
const pm = new productManager();
const Product = require('../classes/dao/models/ProductModel.js');

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const productsData = await pm.getProducts({ limit, page, sort, query });
    
    const cleanProducts = productsData.products.map(product => {
      return {
        title: product.title,
        description: product.description,
        price: product.price,
        status: product.status,
        stock: product.stock,
        category: product.category,
        thumbnail: product.thumbnail
      };
    })

    res.render("productsindex", {
      status: "success",
      products: cleanProducts,
      totalPages: productsData.totalPages,
      prevPage: productsData.prevPage,
      nextPage: productsData.nextPage,
      page: productsData.page,
      hasPrevPage: productsData.hasPrevPage,
      hasNextPage: productsData.hasNextPage,
      prevLink: productsData.hasPrevPage ? `/api/products?limit=${limit}&page=${productsData.prevPage}&sort=${sort}&query=${query}` : null,
      nextLink: productsData.hasNextPage ? `/api/products?limit=${limit}&page=${productsData.nextPage}&sort=${sort}&query=${query}` : null
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
