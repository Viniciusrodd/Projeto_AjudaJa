
// import modules
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');
const RequestController = require('../controller/requestController.js');
const OfferController = require('../controller/offerController.js');
const CampaignController = require('../controller/campaignController.js');
const chatController = require('../controller/chatController.js');


// multer
const multer = require('multer');
const storage = multer.memoryStorage(); // files sended are saves temporarily in RAM
const upload = multer({ storage });


// middleware
const middleware = require('../middleware/verifyToken.js');
const campaignController = require('../controller/campaignController.js');
router.post('/verifyToken', middleware.verifyToken, (req, res) => {
    return res.status(200).send({ msg: 'Token is valid', user: req.user });
});


// port 2130 // User
router.post('/user', upload.single('image'), userController.registerUser);
router.post('/login', userController.Login);
router.get('/user/:userID', middleware.verifyToken, userController.findUser);
router.get('/users', middleware.verifyToken, userController.findAllUsers);
router.get('/user/search/:userName', middleware.verifyToken, userController.findUserByName);
router.put('/user/:userID', upload.single('image'), middleware.verifyToken, userController.editUser);
router.delete('/user/:userID', middleware.verifyToken, userController.deleteUser.bind(userController));
router.get('/logOut', middleware.verifyToken, userController.logOutRoute.bind(userController));


// port 2130 // RequestHelp
router.post('/request/:userID', middleware.verifyToken, RequestController.postCreate);
router.get('/requests', middleware.verifyToken, RequestController.findRequests.bind(RequestController));
router.get('/request/:requestID', middleware.verifyToken, RequestController.findRequestsByPk);
router.get('/request/search/:requestTitle', middleware.verifyToken, RequestController.findRequestByTitle);
router.get('/requests/:userID', middleware.verifyToken, RequestController.findRequestByUserId);
router.put('/request/:requestID', middleware.verifyToken, RequestController.editRequest);
router.delete('/request/:requestID', middleware.verifyToken, RequestController.deleteRequest);


// port 2130 // OfferHelp
router.post('/offer/:userID/:requestID', middleware.verifyToken, OfferController.offerCreate);
router.get('/offers', middleware.verifyToken, OfferController.findOffers);
router.get('/offers/:userID', middleware.verifyToken, OfferController.findOffersByUserId);
router.get('/offer/:offerID', middleware.verifyToken, OfferController.findOffersById);
router.put('/offer/status/:offerID', middleware.verifyToken, OfferController.offerStatusDecision);
router.put('/offer/:offerID', middleware.verifyToken, OfferController.editOffers);
router.delete('/offer/:offerID', middleware.verifyToken, OfferController.deleteOffer);


// port 2130 // Campaign
router.post('/campaign', middleware.verifyToken, CampaignController.createCampaign);
router.get('/campaigns', middleware.verifyToken, CampaignController.findCampaigns);
router.get('/campaign/search/:titleRequest', middleware.verifyToken, CampaignController.findCampaignByTitle);
router.get('/campaigns/:moderatorID', middleware.verifyToken, CampaignController.findCampaignsByModerator); // not in use
router.get('/campaign/:campaignID', middleware.verifyToken, CampaignController.findCampaignByPk);
router.put('/campaign/:campaignID', middleware.verifyToken, CampaignController.editCampaign);
router.delete('/campaign/:campaignID', middleware.verifyToken, campaignController.deleteCampaign);


// port 2130 // chat
router.get('/messages/:userID', middleware.verifyToken, chatController.messagesBetweenUsers);



module.exports = router;