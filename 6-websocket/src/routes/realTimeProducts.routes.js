const express = require("express");
const router = express.Router();
const configureWebSocket = require("../controllers/websocketController");
const ProductManager = require("../classes/productManager");

// Crear una instancia del gestor de productos
const productManager = new ProductManager("./src/json/products.json");

// Ruta para la vista realTimeProducts
router.get("/realtimeproducts", (req, res) => {
  // Configurar WebSocket y pasar la instancia del gestor de productos
  const websocketIO = configureWebSocket(req.app.io.of("/realtimeproducts"), productManager);

  // Imprimir mensaje cuando el cliente se conecta
  websocketIO.on("connection", (socket) => {
    console.log("Cliente conectado");
  });

  // Renderizar la vista con la lista de productos
  res.render("realTimeProducts");
});

module.exports = router;
