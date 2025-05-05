
// import modules
const express = require('express');
const cors = require('cors');
const router = require('./routes/routes.js'); 
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// cookie parser
app.use(cookieParser()) // this middleware allow us to read cookies
app.use(express.json({ limit: '10mb' })); // "limit" for receive large datas
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// use modules
app.use(cors({
    origin: process.env.FRONTEND_PORT,
    credentials: true
}));


app.use('/', router);


module.exports = app;