const express = require('express');
const router = express.Router();

const Message = require('../classes/dao/models/ChatModel'); 

const configureChatroom = (io) => {

  io.on('connection', (socket) => {

    console.log('User connected:', socket.id);

    socket.on('setUsername', (username) => {
      socket.username = username;
      console.log('User connected:', socket.username);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.username); 
    });

    socket.on('chatMessage', async (msg) => {
      
      const message = new Message({
        username: socket.username,
        message: msg
      });

      await message.save();

      io.emit('newMessage', message);

    });

  });

}


router.get('/', async (req, res) => {

  try {
    const messages = await Message.find();
    res.render('chatview', { messages }); 
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }

});

module.exports = { configureChatroom, router };
