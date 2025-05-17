
// import modules
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');
const RequestController = require('../controller/requestController.js');
const OfferController = require('../controller/offerController.js');


// multer
const multer = require('multer');
const storage = multer.memoryStorage(); // files sended are saves temporarily in RAM
const upload = multer({ storage });


// middleware
const middleware = require('../middleware/verifyToken.js');
const requestController = require('../controller/requestController.js');
router.post('/verifyToken', middleware.verifyToken, (req, res) => {
    return res.status(200).send({ msg: 'Token is valid', user: req.user });
});


// port 2130 // User
router.post('/register', upload.single('image'), userController.registerUser);
router.post('/login', userController.Login);
router.get('/findUser/:userID', middleware.verifyToken, userController.findUser);
router.put('/updateUser/:userID', upload.single('image'), middleware.verifyToken, userController.editUser);
router.delete('/deleteUser/:userID', middleware.verifyToken, userController.deleteUser.bind(userController));
router.get('/logOut', middleware.verifyToken, userController.logOutRoute.bind(userController));


// port 2130 // RequestHelp
router.post('/createRequest/:userID', middleware.verifyToken, RequestController.postCreate);
router.get('/requests', middleware.verifyToken, RequestController.findRequests.bind(RequestController));
router.get('/request/:requestID', middleware.verifyToken, RequestController.findRequestsByPk);
router.get('/requestSearch/:requestTitle', middleware.verifyToken, RequestController.findRequestByTitle);
router.put('/updateRequest/:requestID', middleware.verifyToken, RequestController.editRequest);
router.delete('/deleteRequest/:requestID', middleware.verifyToken, RequestController.deleteRequest);


// port 2130 // OfferHelp
router.post('/createOffer/:userID/:requestID', middleware.verifyToken, OfferController.offerCreate);
router.get('/offers', middleware.verifyToken, OfferController.findOffers);


module.exports = router;