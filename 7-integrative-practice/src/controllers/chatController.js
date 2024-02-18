const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server)

io.on('connection', (socket) => {
    socket.on('username', (username) => {
      console.log('Username received: ', username);
      socket.username = username;
      console.log("User connected: "+socket.username)
      socket.emit('user connect notice', `${username} connected`)
    });
    console.log("User connected: "+socket.username)
  
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  
    socket.on('chat message', (msg) => {
      let fullMsg = `${socket.username}: ${msg}`; 
      io.emit('chat message', fullMsg);
      socket.emit('chat message', fullMsg);
    });
});  