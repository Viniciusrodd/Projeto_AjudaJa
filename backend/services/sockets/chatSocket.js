
const Message = require('../../mongoDatabase/Collections/Messages');

const chatSocket = (io) =>{
    io.on('connection', (socket) =>{
        console.log('New user connected at chatSocket: ', socket.id);

        // enter in a private room
        socket.on('join', (userId) =>{
            socket.join(userId); // in the room with is own id
            console.log(`User: ${userId} entered in his own room`)
        });

        // private message
        socket.on('private-message', async ({ from, to, content }) =>{
            const newMessage = new Message({ from, to, content }); // model instance
            await newMessage.save();

            // Send a message to destiny (if he's in the room)
            io.to(to).emit("private-message", newMessage);

            /* (optional) send back to sender for confirm
            socket.emit("private-message", newMessage);
            */            
        });

        // disconnect user
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};


module.exports = chatSocket;