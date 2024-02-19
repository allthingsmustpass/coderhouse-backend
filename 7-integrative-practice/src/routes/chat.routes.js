const express = require("express");
const router = express.Router();
const Message = require('../classes/dao/models/ChatModel');

const configureChatroom = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('username', (username) => {
            console.log('Username received:', username);
            socket.username = username;
            console.log('User connected:', socket.username);
            socket.emit('user connect notice', `${username} connected`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.username);
        });

        socket.on('chat message', async (msg) => {
            console.log('Message received:', msg);
            const newMessage = new Message({
                user: socket.username,
                message: msg
            });
          
            try {
                await newMessage.save();
            } catch (error) {
                console.error('Error saving message:', error);
            }
        
            io.emit('chat message', `${socket.username}: ${msg}`);
        });
    });
};

router.get('/', (req, res) => {
    try {
        res.render('chatview');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = { router, configureChatroom };
