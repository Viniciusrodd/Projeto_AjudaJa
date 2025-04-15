
// import modules
const express = require('express');
const cors = require('cors');
const router = require('./routes/routes.js'); 

const app = express();

// use modules
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', router);


module.exports = app;