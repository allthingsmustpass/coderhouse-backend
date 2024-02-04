const socketIO = require("socket.io");

const configureWebSocket = (server, productManager) => {
  const io = socketIO(server);

  io.on("connection", async (socket) => {
    console.log("Cliente conectado:", socket.id);
    try {
      const initialProducts = await productManager.getProducts();
      socket.emit("updateProducts", initialProducts);
    } catch (error) {
      console.error("Error obteniendo productos:", error);
    }
  });

  return io;
};

module.exports = configureWebSocket;
