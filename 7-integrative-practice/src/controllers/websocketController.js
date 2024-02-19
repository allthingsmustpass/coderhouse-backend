const socketIO = require("socket.io");
const ProductManager = require("../classes/dao/ProductManager");

const configureWebSocket = (server) => {
    const io = socketIO(server);
    const productManager = new ProductManager();

    io.on("connection", async (socket) => {
        console.log("Client from websocketController:", socket.id);
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
