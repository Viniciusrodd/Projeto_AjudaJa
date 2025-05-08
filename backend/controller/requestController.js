
// data base stuffs
const { RequestModel, UserModel, CampaignModel, OfferModel } = require('../Database/Relations');
const connection = require('../Database/Connection/connection');


// class
class Request{
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
};


module.exports = new Request();