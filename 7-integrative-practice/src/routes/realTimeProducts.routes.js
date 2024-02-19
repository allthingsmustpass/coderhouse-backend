const express = require("express");
const router = express.Router();
const productManager = require("../classes/dao/ProductManager");
const pm = new productManager("./src/json/products.json");


const configureWebSocketHandler = (io) => {
  io.of("/realtimeproducts").on("connection", async (socket) => {
    console.log("Client connected from realTimeProducts:", socket.id);
    try {
      const initialProducts = await pm.getProducts();
      socket.emit("updateProducts", initialProducts);
    } catch (error) {
      console.error("Error:", error);
    }
  });
};

router.get("/", (req, res) => {
  res.render("realTimeProducts");
});

module.exports = { router, configureWebSocketHandler };
