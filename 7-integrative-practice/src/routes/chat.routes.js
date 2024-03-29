const express = require("express");
const router = express.Router();
const socketIO = require("socket.io");
const { processChatMessage } = require("../controllers/chatController");

const configureChatHandler = (server) => {
    const io = socketIO(server);
    io.of("/chatview").on("connection", async (socket) => {
        console.log("Client connected from chatController:", socket.id);
        try {
            await processChatMessage(io, socket);
        } catch (error) {
            console.error("Error:", error);
        }
    });
};

router.get("/", (req, res) => {
    res.render("chatview");
});

module.exports = { router, configureChatHandler };
