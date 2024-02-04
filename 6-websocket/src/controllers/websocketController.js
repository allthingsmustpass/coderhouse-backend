const socketIO = require("socket.io");

const configureWebSocket = (server, productManager) => {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);
    const initialProducts = productManager.getProducts();
    socket.emit("updateProducts", initialProducts);
  });

  return io;
};

module.exports = configureWebSocket;
