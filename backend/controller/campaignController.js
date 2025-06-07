
// data base
const { RequestModel, UserModel, CampaignModel, OfferModel } = require('../Database/Relations');
const connection = require('../Database/Connection/connection');
const { Op } = require('sequelize');

// services
const ExpiredCampaigns_service = require('../services/campaignServices/endDate'); 


// class
class Campaign{
    // create
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
            if(startDate < today.setHours(0,0,0,0)){
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
            if(endDate > maxEndDate){
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


    // find all
    async findCampaigns(req, res){
        try{
            // check at campaigns expired...
            await ExpiredCampaigns_service.expiresCampaign();

            // get campaigns
            const campaign_data = await CampaignModel.findAll({
                order: [['end_date', 'ASC']]
            });

            if(campaign_data.length === 0){
                return res.status(204).send({
                    noContent: `There's no Campaigns...`
                });
            }

            // get moderator id's from campaign data
            const moderators_ids = campaign_data.map(campaign => campaign.moderator_id);

            // get users
            const users = await UserModel.findAll({
                where: {
                    id: { [Op.in]: moderators_ids }
                }
            });

            // get users names
            const userMap = {};
            users.forEach((user) =>{
                userMap[user.id] = {
                    name: user.name
                };
            });

            // combine datas
            const combined_campaigns = campaign_data.map(campaign =>({
                ...campaign.dataValues,
                user_data: userMap[campaign.moderator_id]
            }));

            return res.status(200).send({
                msg: 'Campaigns find with success',
                combined_campaigns
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


    // find by title
    async findCampaignByTitle(req, res){
        const title_request = req.params.titleRequest;
        if(!title_request){
            return res.status(400).send({
                error: 'Bad request at title_request params'
            });
        }

        try{
            const campaign_data = await CampaignModel.findAll({
                where: {
                    title: { [Op.like]: `%${title_request}%` }
                },
                order: [['end_date', 'ASC']]
            });

            if(campaign_data.length === 0){
                return res.status(204).send({
                    msg: 'No Campaigns found matching the title'
                });
            }

            // get moderator id's from campaign data
            const moderators_ids = campaign_data.map(campaign => campaign.moderator_id);

            // get users
            const users = await UserModel.findAll({
                where: {
                    id: { [Op.in]: moderators_ids }
                }
            });

            // get users names
            const userMap = {};
            users.forEach((user) =>{
                userMap[user.id] = {
                    name: user.name
                };
            });

            // combine datas
            const combined_campaigns = campaign_data.map(campaign =>({
                ...campaign.dataValues,
                user_data: userMap[campaign.moderator_id]
            }));

            return res.status(200).send({
                msg: 'Campaigns by title find with success',
                combined_campaigns
            });
        }
        catch(error){
            console.log('Internal server error at Find campaign by title', error);
            return res.status(500).send({
                msgError: 'Internal server error at Find campaign by title',
                details: error.response?.data || error.message
            });
        }
    };


    // find campaigns by moderator id
    async findCampaignsByModerator(req, res){ // not in use
        const moderatorId = req.params.moderatorID;
        if(!moderatorId){
            return res.status(400).send({
                error: 'Bad request at moderator id params'
            });
        }

        try{
            const campaign_data = await CampaignModel.findAll({
                where: {
                    moderator_id: moderatorId
                },
                order: [['end_date', 'ASC']]
            });

            if(campaign_data.length === 0){
                return res.status(204).send({
                    noContent: `There's no campaigns for the submitted moderator ID...`
                });
            }

            const user = await UserModel.findByPk(moderatorId);
            if(!user){
                return res.status(404).send({
                    noContent: `Moderator not found...`
                });
            }

            const combined_campaigns = campaign_data.map(campaigns =>({
                ...campaigns.dataValues,
                user_name: user.name
            }));

            return res.status(200).send({
                msg: 'Moderator Campaigns find with success',
                combined_campaigns
            });
        }
        catch(error){
            console.log('Internal server error at Find campaign by moderator', error);
            return res.status(500).send({
                msgError: 'Internal server error at Find campaign by moderator',
                details: error.response?.data || error.message
            });
        }
    };


    // find campaigns by id
    async findCampaignByPk(req, res){
        const campaignId = req.params.campaignID;
        if(!campaignId){
            return res.status(400).send({
                error: 'Bad request at campaignId params'
            });
        }

        try{
            const campaign_data = await CampaignModel.findByPk(campaignId);
            if(!campaign_data){
                return res.status(204).send({
                    noContent: `There's no campaign...`
                });
            }

            return res.status(200).send({
                msg: 'Campaign find with success',
                campaign_data
            });
        }
        catch(error){
            console.log('Internal server error at Find campaign by id', error);
            return res.status(500).send({
                msgError: 'Internal server error at Find campaign by id',
                details: error.response?.data || error.message
            });
        }
    };


    // campaigns edit
    async editCampaign(req, res){
        const campaignId = req.params.campaignID;
        const { title, description, start_date, end_date } = req.body;

        if(!campaignId){
            return res.status(400).send({
                error: 'Bad request at campaignId params'
            });
        }

        try{
            const updateFields = {};

            if(title) updateFields.title = title;
            if(description) updateFields.description = description;

            // get dates
            const endDate = new Date(end_date);
            if(start_date){
                const original_date = await CampaignModel.findByPk(campaignId);
                if(start_date < original_date.start_date){
                    return res.status(400).send({
                        error: 'Start date cannot be smaller than previous start date'
                    });
                }
            
                updateFields.start_date = start_date;
            };
            if(end_date){
                // end date must be within the next year
                const maxEndDate = new Date();
                maxEndDate.setFullYear(maxEndDate.getFullYear() + 1); // next year
                maxEndDate.setMonth(11);  // december (0-11)
                maxEndDate.setDate(31);   // last day of year
                maxEndDate.setHours(23,59,59,999);
                if(endDate > maxEndDate){
                    return res.status(400).send({
                        error: `End date must be within the next year`
                    });
                }
            
                updateFields.end_date = end_date;
            };

            // updating
            await CampaignModel.update(updateFields,{
                where: { id: campaignId }
            });

            return res.status(200).send({
                msg: 'Campaign updated with success'
            });
        }
        catch(error){
            console.log('Internal server error at Edit campaign', error);
            return res.status(500).send({
                msgError: 'Internal server error at Edit campaign',
                details: error.response?.data || error.message
            });
        }
    };
};


module.exports = new Campaign();