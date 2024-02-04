const express = require("express");
const router = express.Router();
const configureWebSocket = require("../controllers/websocketController");
const productManager = require("../classes/ProductManager");
const pm = new productManager("./src/json/products.json");

const configureWebSocketHandler = (server) => {
  const io = configureWebSocket(server, productManager);

  io.of("/realtimeproducts").on("connection", async (socket) => {
    console.log("Cliente conectado a WebSocket:", socket.id);
    try {
      const initialProducts = await pm.getProducts();
      let responseProducts = initialProducts
      socket.emit("updateProducts", initialProducts);
    } catch (error) {
      console.error("Error obteniendo productos:", error);
    }
  });
};


router.get("/", (req, res) => {
  res.render("realTimeProducts");
});

module.exports = { router, configureWebSocketHandler };
