
// modules
const app = require('./app.js');
const Connection = require('./Database/Connection/connection.js');
const mongoConnection = require('./mongoDatabase/mongoConnection.js');
require('dotenv').config();
const relations = require('./Database/Relations.js');



Connection.authenticate()
    .then(() => {
        console.log('Database authenticated');
        return Connection.sync();
    })
    .catch((error) => {
        console.log('Database error at authenticated', error);
    });


// server opens
app.listen(process.env.BACKEND_PORT, () =>{
    console.log('Server opens success');
});