
// import modules
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');


// multer
const multer = require('multer');
const storage = multer.memoryStorage(); // files sended are saves temporarily in RAM
const upload = multer({ storage });


// middleware
const middleware = require('../middleware/verifyToken.js');
router.post('/verifyToken', middleware.verifyToken, (req, res) => {
    return res.status(200).send({ msg: 'Token is valid', user: req.user });
});


//port 2130 //User
router.post('/register', upload.single('image'), userController.registerUser);
router.post('/login', userController.Login);
router.get('/findUser/:userID', userController.findUser);
router.put('/updateUser/:userID', upload.single('image'), userController.editUser);
router.delete('/deleteUser/:userID', middleware.verifyToken, userController.deleteUser.bind(userController));
router.get('/logOut', middleware.verifyToken, userController.logOutRoute.bind(userController));


module.exports = router;