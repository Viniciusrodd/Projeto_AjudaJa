
// import modules
import express from 'express';
const router = express.Router();
import userController from '../controller/userController.js';


// User routes => PORT: 2130
router.get('/teste', userController.test);


export default router;