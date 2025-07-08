
// data bases
const MessageModel = require('../../mongoDatabase/Collections/Messages');
const NotificationsModel = require('../../Database/models/NotificationsModel');


// chat
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
            // messages mongo document
            const newMessage = new MessageModel({ from, to, content }); // model instance
            await newMessage.save();

            // notifications sql model
            await NotificationsModel.create({
                user_id: to,
                from_user_id: from
            });

            // Send a message to destiny (if he's in the room)
            io.to(to).emit('private-message', newMessage);
            io.to(to).emit('notification-message', from);

            /* (optional) send back to sender for confirm
            socket.emit("private-message", newMessage);
            */            
        });

        // disconnect user
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};


module.exports = chatSocket;