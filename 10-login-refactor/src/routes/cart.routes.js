const express = require("express");
const router = express.Router();
const CartManager = require("../classes/dao/cartManager.js");
const cm = new CartManager();

router.get("/", async (req, res) => {
  try {
    const allCarts = await cm.getAllCarts();
    return res.json({ carts: allCarts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "500: Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await cm.getCartById(cartId).populate('products');

    if (cart) {
      return res.json({ cart });
    } else {
      return res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "500: Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await cm.createCart();
    return res.json(newCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "500: Internal server error" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    await cm.removeProductFromCart(cartId, productId);
    return res.json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "500: Internal server error" });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const products = req.body.products;
    await cm.updateCart(cartId, products);
    return res.json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "500: Internal server error" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = parseInt(req.body.quantity) || 1;

    const cart = await cm.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const updatedProducts = cart.products.map(product => {
      if (product.productId === productId) {
        return { productId: productId, quantity: quantity };
      } else {
        return product;
      }
    });

    await cm.updateCart(cartId, updatedProducts);

    return res.json({ message: "Product quantity updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "500: Internal server error" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    await cm.deleteCart(cartId);
    return res.json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "500: Internal server error" });
  }
});

module.exports = router;
