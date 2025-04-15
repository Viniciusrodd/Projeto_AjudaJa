
// import modules
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');


// User routes => PORT: 2130
router.get('/teste', userController.test);


module.exports = router;