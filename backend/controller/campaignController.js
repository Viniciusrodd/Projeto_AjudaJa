
// data base
const { RequestModel, UserModel, CampaignModel, OfferModel } = require('../Database/Relations');
const connection = require('../Database/Connection/connection');
const { Op } = require('sequelize');


// class
class Campaign{
    async createCampaign(req, res){
        const { moderator_id, title, description, start_date, end_date } = req.body;
        if(!moderator_id || !title || !description || !start_date || !end_date){
            return res.status(400).send({
                error: 'Bad request at fields sended'
            });
        }

        try{
            const isModerator = await UserModel.findOne({
                where: { id: moderator_id }
            });

            if(!isModerator){
                return res.status(404).send({
                    noContent: `Moderator not found with provided ID`
                }); 
            }

            if(isModerator.role !== 'moderador'){
                return res.status(401).send({
                    Unauthorized: `it is necessary to be a moderator`
                });
            }

            const campaign = await CampaignModel.create({
                moderator_id, title, description, start_date, end_date
            });

            return res.status(200).send({
                msg: 'Campaign created with success',
                campaign
            });
        }
        catch(error){
            console.log('Internal server error at create campaign', error);
            return res.status(500).send({
                msgError: 'Internal server error at create campaign',
                details: error.response?.data || error.message
            });
        }
    };
};


module.exports = new Campaign();