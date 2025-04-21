
// import modules
const express = require('express');
const cors = require('cors');
const router = require('./routes/routes.js'); 
const cookieParser = require('cookie-parser');

const app = express();

// cookie parser
app.use(cookieParser()) // this middleware allow us to read cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use modules
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


app.use('/', router);


module.exports = app;