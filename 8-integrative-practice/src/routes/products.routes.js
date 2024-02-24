const express = require("express");
const router = express.Router();
const productManager = require("../classes/dao/ProductManager.js");
const pm = new productManager();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || null;
    const query = req.query.query || null;

    const result = await pm.getProducts({ limit, page, sort, query });

    res.json({
      status: "success",
      payload: result.products,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
      nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
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
      res.render('products', { product: searchId });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id/view", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await pm.getProductById(id);
    if (product) {
      return res.render('product', { product });
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error(error);
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
