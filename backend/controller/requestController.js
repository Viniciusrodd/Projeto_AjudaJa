
// data base stuffs
const { RequestModel, UserModel, CampaignModel, OfferModel } = require('../Database/Relations');
const connection = require('../Database/Connection/connection');
const ProfileImage = require('../mongoDatabase/Collections/profileImages');
const { Op } = require('sequelize');


// class
class Request{
    // create request
    async postCreate(req, res){
        const user_id = req.params.userID;
        const { title, description, category, urgency, latitude, longitude } = req.body;
        
        //console.log('____________________________')
        //console.log(title, description, category, urgency, latitude, longitude)
        //console.log('____________________________')

        if(!user_id || !title || !description || !category || !urgency || !latitude && !longitude){
            return res.status(400).send({
                error: 'Bad request at fields sended'
            });
        }

        try{
            const urgencyDurations = {
                alta: 2,
                media: 5,
                baixa: 10
            };

            let expires_at = new Date();
            expires_at = expires_at.setDate(expires_at.getDate() + urgencyDurations[urgency]);

            await RequestModel.create({ 
                user_id, title, description, category, urgency, status: true, latitude, longitude, expires_at 
            });

            console.log('Request post create with success');
            return res.status(200).send({
                msg: 'Request post create with success'
            });
        }
        catch(error){
            console.error('Internal server error at Post creation', error);
            return res.status(500).send({
                msgError: 'Internal server error at Post creation', error,
                details: error.response?.data || error.message
            });
        }
    };


    // requests expires_at
    async expiresRequest(){
        try{
            const currentDate = new Date();

            await connection.transaction(async (t) =>{
                // get expires requests...
                const expires_requests = await RequestModel.findAll({
                    where: {
                        expires_at: { [Op.lt]: currentDate }
                    },
                    transaction: t
                });

                // get expires requests id's...
                const expires_ids = expires_requests.map(request => request.id);

                if(expires_ids.length > 0){
                    // delete offers related...
                    const offersDeleted = await OfferModel.destroy({
                        where: { 
                            request_id: { [Op.in]: expires_ids } 
                        },
                        transaction: t
                    });

                    // delete expired requests...
                    const requestsDeleted = await RequestModel.destroy({
                        where: {
                            id: { [Op.in]: expires_ids }
                        },
                        transaction: t
                    });

                    console.log(`Expired requests found: ${expires_ids.length}`);
                    console.log('Requests deleted count: ',requestsDeleted);
                    console.log('Offers deleted count: ',offersDeleted);
                }else{
                    console.log('No expired requests found to delete.');
                }
            });
        }
        catch(error){
            console.error('Internal server error at expires a request', error);   
        };
    };


    // find requests
    async findRequests(req, res){
        try{
            // check at requests expired
            await this.expiresRequest();

            // get requests
            const request_data = await RequestModel.findAll({
                order: [['expires_at', 'DESC']]
            });

            if(!request_data){
                return res.status(204).send({
                    noContent: `There's no help requests...`
                });
            }

            // get users ids from requests
            const users_id = request_data.map(data => data.user_id);
            
            // get user data from requests user_id
            const userData = await UserModel.findAll({
                where: {
                    id: {
                        [Op.in]: users_id
                    }
                }
            });

            // mapping user name => requests
            const userMap = {};
            userData.forEach((user) =>{
                userMap[user.id] = {
                    name: user.name
                };
            });

            // associated images
            const profile_images = await ProfileImage.find({
                user_id: { $in: users_id }
            });

            // mapping user_id => images
            const imageMap = {};
            profile_images.forEach((image) =>{
                imageMap[image.user_id] = {
                    image_data: image.image_data,
                    content_type: image.content_type
                };
            });

            // combine request data with images associated
            const combined_requests = request_data.map(request =>({
                ...request.dataValues, // sequelize instances, we need to extract the data
                user_data: userMap[request.user_id],
                profile_image: imageMap[request.user_id] || null
            }));
            // =>{} 'bloco de código'
            // =>({}) 'objeto explicito'

            return res.status(200).send({
                msg: 'Help requests find with success',
                combined_requests
            });
        }
        catch(error){
            console.error('Internal server error at Find requests', error);
            return res.status(500).send({
                msgError: 'Internal server error at Find requests', error,
                details: error.response?.data || error.message
            });
        };
    };


    // find requests by id
    async findRequestsByPk(req, res){
        const requestId = req.params.requestID;
        if(!requestId){
            return res.status(400).send({
                error: 'Bad request at requestId params'
            });
        }

        try{
            const request_data = await RequestModel.findByPk(requestId);

            if(!request_data){
                return res.status(204).send({
                    noContent: `There's no help requests...`
                });
            }

            return res.status(200).send({
                msg: 'Help request find with success',
                request_data
            });
        }
        catch(error){
            console.error('Internal server error at Find request by id', error);
            return res.status(500).send({
                msgError: 'Internal server error at Find request by id',
                details: error.response?.data || error.message
            });
        }
    };


    // find request by title
    async findRequestByTitle(req, res){
        const request_title = req.params.requestTitle;
        if(!request_title){
            return res.status(400).send({
                error: 'Bad request at request_title params'
            });
        }

        try{
            const request_data = await RequestModel.findAll({
                where: { 
                    title: { [Op.like]: `%${request_title}%` } 
                }
            });

            if(request_data.length === 0){
                return res.status(204).send({
                    msg: 'No requests found matching the title'
                });
            }

            // get users ids from requests
            const users_id = request_data.map(data => data.user_id);

            // get user data from requests user_id
            const userData = await UserModel.findAll({
                where: {
                    id: {
                        [Op.in]: users_id
                    }
                }
            });

            // mapping user name => requests
            const userMap = {};
            userData.forEach((user) =>{
                userMap[user.id] = {
                    name: user.name
                };
            });

            // associated images
            const profile_images = await ProfileImage.find({
                user_id: { $in: users_id }
            });

            // mapping user_id => images
            const imageMap = {};
            profile_images.forEach((image) =>{
                imageMap[image.user_id] = {
                    image_data: image.image_data,
                    content_type: image.content_type
                };
            });

            // combine request data with images associated
            const combined_requests = request_data.map(request =>({
                ...request.dataValues, // sequelize instances, we need to extract the data
                user_data: userMap[request.user_id],
                profile_image: imageMap[request.user_id] || null
            }));


            return res.status(200).send({
                successMsg: 'Matching requests found',
                combined_requests
            });
        }
        catch(error){
            console.error('Internal server error at find request by title', error);
            return res.status(500).send({
                msgError: 'Internal server error at find request by title',
                details: error.response?.data || error.message
            });
        }
    };


    // edit requests
    async editRequest(req, res){
        const requestId = req.params.requestID;
        const { title, description, category, urgency, status } = req.body;

        if(!requestId){
            return res.status(400).send({
                error: 'Bad request at requestId params'
            });
        }

        try{
            const updateFields = {};

            if(title){ updateFields.title = title };
            if(description){ updateFields.description = description };
            if(category){ updateFields.category = category };
            if(urgency){ updateFields.urgency = urgency };
            if(status){ updateFields.status = status };

            await RequestModel.update(updateFields, {
                where: { id: requestId }
            });

            return res.status(200).send({
                msg: 'Request post updated with success'
            });
        }
        catch(error){
            console.error('Internal server error at Edit request', error);
            return res.status(500).send({
                msg: 'Internal server error at Edit request',
                details: error.response?.data || error.message
            });
        };
    };


    // delete request
    async deleteRequest(req, res){
        const requestId = req.params.requestID;
        if(!requestId){
            return res.status(400).send({
                errorMsg: 'Bad request at user id params...' 
            });
        }

        try{
            await connection.transaction(async (t) =>{
                await OfferModel.destroy({
                    where: { request_id: requestId },
                    transaction: t
                });

                await RequestModel.destroy({
                    where: { id: requestId },
                    transaction: t
                });
            });
            
            return res.status(200).send({
                successMsg: 'Help request + self relations deleted with success'
            });
        }
        catch(error){
            console.error('Internal server error at delete request', error);
            return res.status(500).send({
                msg: 'Internal server error at delete request',
                details: error.response?.data || error.message
            });
        };
    };
};


module.exports = new Request();