
// import modules
const express = require('express');
const cors = require('cors');
const router = require('./routes/routes.js'); 
const connection = require('./connection/connection.js');

const app = express();

// use modules
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connection.authenticate()
    .then(() => {
        console.log('Database authenticated');
        return connection.sync();
    })
    .catch((error) => {
        console.log('Database error at authenticated', error);
    });


app.use('/', router);


module.exports = app;