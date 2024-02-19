const Message = require('../classes/dao/models/ChatModel');;

const processChatMessage = async (socket) => {
    try {
        if (!socket.username) {
            socket.on('setUsername', (username) => {
                socket.username = username;
                console.log(`Usuario conectado: ${socket.username}`);
                socket.emit('usernameConfirmation', `¡Bienvenido, ${socket.username}!`);
            });
        }

        socket.on('chatMessage', async (msg) => {
            console.log(`Mensaje recibido de ${socket.username}: ${msg}`);
            const newMessage = new Message({
                user: socket.username,
                message: msg
            });
            await newMessage.save();
            socket.broadcast.emit('newMessage', { user: socket.username, message: msg });
        });

        socket.on('disconnect', () => {
            if (socket.username) {
                console.log(`Usuario desconectado: ${socket.username}`);
            }
        });
    } catch (error) {
        console.error('Error al procesar el mensaje de chat:', error);
    }
};

module.exports = { processChatMessage };
