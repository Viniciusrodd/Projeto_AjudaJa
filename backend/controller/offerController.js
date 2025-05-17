
// data base
const { RequestModel, UserModel, CampaignModel, OfferModel } = require('../Database/Relations');
const connection = require('../Database/Connection/connection');
const { Op } = require('sequelize');


// class
class Offer{
    // create offer
    async offerCreate(req, res){
        const { userID, requestID } = req.params;
        const description = req.body.description;

        if(!userID || !requestID || !description){
            return res.status(400).send({
                error: 'Bad request at parameters/data sended'
            });
        }

        try{
            const offers = await OfferModel.create({
                user_id: userID, request_id: requestID, description
            });

            console.log('Help Offer created with success');
            return res.status(200).send({
                msg: 'Help Offer created with success',
                offers
            });
        }
        catch(error){
            console.error('Internal server error at Offer creation', error);
            return res.status(500).send({
                msgError: 'Internal server error at Offer creation',
                details: error.response?.data || error.message 
            });
        }
    };


    // find offers
    async findOffers(req, res){
        try{
            const offers = await OfferModel.findAll();

            if(!offers){
                return res.status(204).send({
                    noContent: `There's no help requests...`
                });
            }

            return res.status(200).send({
                msg: 'Offers find with success',
                offers
            });
        }
        catch(error){
            console.error('Internal server error at Find Offers', error);
            return res.status(500).send({
                msgError: 'Internal server error at Find Offers',
                details: error.response?.data || error.message 
            });
        }
    };
};

module.exports = new Offer();