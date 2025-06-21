
// modules
const app = require('./app.js');
const http = require('http');
const { Server } = require('socket.io');
const Connection = require('./Database/Connection/connection.js');
const mongoConnection = require('./mongoDatabase/mongoConnection.js');
const chatSocket = require('./services/sockets/chatSocket.js'); // chatSocket service
require('dotenv').config();
const relations = require('./Database/Relations.js');


// socket io server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_PORT,
        credentials: true
    }
});
// init sockets
chatSocket(io);


Connection.authenticate()
    .then(() => {
        console.log('Database authenticated');
        return Connection.sync();
    })
    .catch((error) => {
        console.log('Database error at authenticated', error);
    });


// server opens
server.listen(process.env.BACKEND_PORT, () =>{
    console.log('Server opens success');
});