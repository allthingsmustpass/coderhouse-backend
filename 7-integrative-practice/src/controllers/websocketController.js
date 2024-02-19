const ProductManager = require("../classes/dao/ProductManager");

const configureWebSocket = (io) => {
    const productManager = new ProductManager();

    io.on("connection", async (socket) => {
        console.log("Client connected from websocketController of realTimeProducts:", socket.id);
        try {
            const initialProducts = await productManager.getProducts();
            socket.emit("updateProducts", initialProducts);
        } catch (error) {
            console.error("Error:", error);
        }
    });

    return io;
};

module.exports = configureWebSocket;
