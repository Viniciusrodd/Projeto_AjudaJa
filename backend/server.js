
// modules
const app = require('./app.js');
const Connection = require('./Database/Connection/connection.js');
const mongoConnection = require('./mongoDatabase/mongoConnection.js');

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
app.listen(2130, () =>{
    console.log('Server opens on 2130 port');
});