
const { RequestModel, OfferModel } = require('../../Database/Relations');
const connection = require('../../Database/Connection/connection');
const { Op } = require('sequelize');


class RequestExpirationService{
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

                    console.log('---------------------------------------------');
                    console.log(`Expired requests found: ${expires_ids.length}`);
                    console.log('Requests deleted count: ',requestsDeleted);
                    console.log('Offers deleted count: ',offersDeleted);
                    console.log('---------------------------------------------');
                }else{
                    console.log('No expired requests found to delete.');
                }
            });
        }
        catch(error){
            console.error('Internal error at expires a request', error);   
        }
    };
};

module.exports = new RequestExpirationService();