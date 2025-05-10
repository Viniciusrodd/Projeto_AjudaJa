
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


    // find requests
    async findRequests(req, res){
        try{
            // get requests
            const request_data = await RequestModel.findAll();

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
            })

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


    // edit requests
    async editRequest(req, res){
        

        try{

        }
        catch(error){
            console.error('Internal server error at Edit request', error);
            return res.status(500).send({
                msg: 'Internal server error at Edit request',
                details: error.response?.data || error.message
            });
        };
    };
};


module.exports = new Request();