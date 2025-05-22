
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
                    noContent: `There's no offers...`
                });
            }

            // get usersId from offers
            const users_ids = offers.map(offer => offer.user_id);

            // get user data from requests user_id
            const userData = await UserModel.findAll({
                where: {
                    id: {
                        [Op.in]: users_ids
                    }
                }
            });

            // mapping user name
            const userMap = {};
            userData.forEach((user) =>{
                userMap[user.id] = {
                    name: user.name
                };
            });

            // combine datas
            const combined_data = offers.map(offer =>({
                ...offer.dataValues,
                user_data: userMap[offer.user_id]
            }));

            return res.status(200).send({
                msg: 'Offers find with success',
                combined_data
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


    // find offers by user id
    async findOffersByUserId(req, res){
        const userId = req.params.userID;
        if(!userId){
            return res.status(400).send({
                error: 'Bad request at parameters sended'
            });            
        }

        try{
            const offers = await OfferModel.findAll({
                where: { user_id: userId }
            });
            if(!offers){
                return res.status(204).send({
                    noContent: `There's no offers...`
                });
            }

            // get requests from offers
            const requests_id = offers.map(offer => offer.request_id);
            const requestData = await RequestModel.findAll({
                where: {
                    id: { [Op.in]: requests_id }
                }
            });
            
            // mapping requests by id
            const requestMap = {};
            requestData.forEach((request) => {
                requestMap[request.id] = request; // id → objeto do request
            });

            // get users from requests
            const users_ids = requestData.map(request => request.user_id);
            const userData = await UserModel.findAll({
                where: { 
                    id: { [Op.in]: users_ids } 
                }
            });

            // get users names from users
            const userMap = {};
            userData.forEach((user) => {
                userMap[user.id] = {
                    name: user.name
                };
            });

            const combined_data = offers.map(offer => {
                const relatedRequest = requestMap[offer.request_id]; // get relacionated request
                const relatedUserId = relatedRequest?.user_id;       // get request owner
                // "?" =  operador de encadeamento opcional do JavaScript

                return {
                    ...offer.dataValues,
                    user_data: userMap[relatedUserId] // requests owners names
                };
            });
            
            return res.status(200).send({
                msg: 'Offers find by userId with success',
                combined_data
            });
        }
        catch(error){
            console.error('Internal server error at Find Offers by userId', error);
            return res.status(500).send({
                msgError: 'Internal server error at Find Offers by userId',
                details: error.response?.data || error.message 
            });
        }
    };


    // find offers by id
    async findOffersById(req, res){
        const offerId = req.params.offerID;
        if(!offerId){
            return res.status(400).send({
                error: 'Bad request at parameters sended'
            });            
        }
        
        try{
            const offers = await OfferModel.findByPk(offerId);

            if(!offers){
                return res.status(204).send({
                    noContent: `There's no offers...`
                });
            }

            return res.status(200).send({
                msg: 'Offers by id find with success',
                offers
            });
        }
        catch(error){
            console.error('Internal server error at Find Offers by id', error);
            return res.status(500).send({
                msgError: 'Internal server error at Find Offers by id',
                details: error.response?.data || error.message 
            });
        }
    };


    // offer status decision
    async offerStatusDecision(req, res){
        const offerId = req.params.offerID;
        const decision = req.body.decision;

        if(!offerId || !decision){
            return res.status(400).send({
                error: 'Bad request at parameters/data sended'
            });
        }

        try{
            const allowedStatuses = ['aceito', 'rejeitado', 'pendente'];
            if (!allowedStatuses.includes(decision)) {
                return res.status(400).send({
                    error: 'Invalid status field'
                });
            }

            await OfferModel.update({ status: decision }, {
                where: { id: offerId }
            });

            return res.status(200).send({
                msg: 'Offer status updated with success'
            });
        }
        catch(error){
            console.error('Internal server error at Offer Decision', error);
            res.status(500).send({
                msgError: 'Internal server error at Offer Decision',
                details: error.response?.data || error.message
            });
        }
    };


    // edit offers
    async editOffers(req, res){
        const offerId = req.params.offerID;
        const description = req.body.description;

        if(!offerId || !description){
            return res.status(400).send({
                error: 'Bad request at parameters/data sended'
            });
        }

        try{
            await OfferModel.update(description, {
                where: { id: offerId }
            });

            return res.status(200).send({
                msg: 'Offer updated with success'
            });
        }
        catch(error){
            console.error('Internal server error at Edit offer', error);
            res.status(500).send({
                msgError: 'Internal server error at Edit offer',
                details: error.response?.data || error.message
            });
        }
    };
};

module.exports = new Offer();