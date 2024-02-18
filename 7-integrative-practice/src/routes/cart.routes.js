const express = require("express");
const router = express.Router();
const CartManager = require("../classes/dao/cartManager.js");
const cm = new CartManager("../src/json/carts.json");

router.post("/", async (req, res) => {
  try {
    const newCart = await cm.createCart();
    return res.json(newCart);
  } catch (e) {
    res.status(500).json({ error: "500: Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const allCarts = await cm.getAllCarts();
    return res.json({ carts: allCarts });
  } catch (e) {
    res.status(500).json({ error: "500: Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await cm.getCartById(cartId);

    if (cart) {
      res.json({ cart });
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (e) {
    res.status(500).json({ error: "500: Internal server error" });
  }
});

router.post("/:id/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.id;
    const productId = req.params.pid;
    const quantity = parseInt(req.body.quantity) || 1;

    await cm.addProductToCart(cartId, productId, quantity);
    return res.json({ message: "Product added to cart successfully" });
  } catch (e) {
    res.status(500).json({ error: "500: Internal server error" });
  }
});

module.exports = router;
