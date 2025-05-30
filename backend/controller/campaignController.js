
// data base
const { RequestModel, UserModel, CampaignModel, OfferModel } = require('../Database/Relations');
const connection = require('../Database/Connection/connection');
const { Op } = require('sequelize');

// services
const ExpiredCampaigns_service = require('../services/campaignServices/endDate'); 


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

            // get dates
            const today = new Date();
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);

            // start date cannot be in the past
            if (startDate < today.setHours(0,0,0,0)) {
                return res.status(400).send({
                    error: 'Start date cannot be in the past'
                });
            }

            // end date must be within the next year
            const maxEndDate = new Date();
            maxEndDate.setFullYear(maxEndDate.getFullYear() + 1); // next year
            maxEndDate.setMonth(11);  // december (0-11)
            maxEndDate.setDate(31);   // last day of year
            maxEndDate.setHours(23,59,59,999);
            if (endDate > maxEndDate) {
                return res.status(400).send({
                    error: `End date must be within the next year`
                });
            }

            // creation
            const campaign = await CampaignModel.create({
                moderator_id, title, description, start_date, end_date
            });

            return res.status(200).send({
                msg: 'Campaign created with success',
                campaign
            });
        }
        catch(error){
            console.log('Internal server error at Create Campaign', error);
            return res.status(500).send({   
                msgError: 'Internal server error at create campaign',
                details: error.response?.data || error.message
            });
        }
    };


    async findCampaigns(req, res){
        try{
            // check at campaigns expired...
            await ExpiredCampaigns_service.expiresCampaign();

            // get campaigns
            const campaign_data = await CampaignModel.findAll({
                order: [['end_date', 'DESC']]
            });

            if(!campaign_data){
                return res.status(204).send({
                    noContent: `There's no Campaigns...`
                });
            }

            return res.status(200).send({
                msg: 'Campaigns find with success',
                campaign_data
            });
        }
        catch(error){
            console.log('Internal server error at Find Campaign', error);
            return res.status(500).send({
                msgError: 'Internal server error at Find Campaign',
                details: error.response?.data || error.message 
            });
        }
    };
};


module.exports = new Campaign();