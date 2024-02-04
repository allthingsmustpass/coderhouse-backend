function configureWebSocket(io, productManager) {
  io.on("connection", (socket) => {
    console.log("Cliente conectado");

    // Enviar la lista de productos al cliente al conectarse
    const initialProducts = productManager.getProducts();
    console.log("Enviando lista inicial de productos:", initialProducts);
    io.emit("updateProducts", initialProducts);

    socket.on("addProduct", async (newProduct) => {
      await productManager.addProduct(newProduct);
      const updatedProducts = productManager.getProducts();
      console.log("Nuevo producto añadido. Enviando lista actualizada:", updatedProducts);
      io.emit("updateProducts", updatedProducts);
    });

    socket.on("deleteProduct", async (productId) => {
      await productManager.deleteProduct(productId);
      const updatedProducts = productManager.getProducts();
      console.log("Producto eliminado. Enviando lista actualizada:", updatedProducts);
      io.emit("updateProducts", updatedProducts);
    });
  });

  return io;
}

module.exports = configureWebSocket;
