
const { CampaignModel } = require('../../Database/Relations');
const { Op } = require('sequelize');


class CampaignExpirationService{
    async expiresCampaign(){
        try{
            const currentDate = new Date();
            // Zerar horas para comparar só a data
            currentDate.setHours(0, 0, 0, 0);

            const expires_campaigns = await CampaignModel.destroy({
                where: {
                    end_date: { [Op.lt]: currentDate }
                }
            });

            if(!expires_campaigns){
                console.log('None campaigns as found for delete...'); 
                return;
            };

            console.log('---------------------------------------');
            console.log(`Campaigns deleted: ${expires_campaigns}`);
            console.log('---------------------------------------');
        }
        catch(error){
            console.error('Internal error at expires a campaign', error);   
        }
    }
}


module.exports = new CampaignExpirationService();