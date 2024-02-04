const express = require("express");
const router = express.Router();
const productManager = require("../classes/productManager.js");
const pm = new productManager("./src/json/products.json");

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || undefined;
    const products = await pm.getProducts();
    let responseProducts = products;

    if (limit) {
      responseProducts = products.slice(0, limit);
    }
    res.render('home', { products: responseProducts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const searchId = await pm.getProductById(id);
      if (searchId) {
        res.render('home', { product: searchId });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (e) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
