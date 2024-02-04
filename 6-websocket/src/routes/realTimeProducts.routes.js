const express = require("express");
const router = express.Router();
const configureWebSocket = require("../controllers/websocketController");
const productManager = require("../classes/ProductManager");

const configureWebSocketHandler = (server) => {
  const io = configureWebSocket(server, productManager);

  io.of("/realtimeproducts").on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);
    const initialProducts = productManager.getProducts();
    socket.emit("updateProducts", initialProducts);
  });
};

router.get("/", (req, res) => {
  console.log("Ingresado");
  res.render("realTimeProducts");
});

module.exports = { router, configureWebSocketHandler };
