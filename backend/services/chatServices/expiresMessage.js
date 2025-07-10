
// dependencies
const mongoose = require('mongoose');

// data bases
const MessageModel = require('../../mongoDatabase/Collections/Messages');


class MessagesExpiresService{
    async expiresMessage(userA, userB){
        const expirationDate = 1000 * 60 * 60 * 24 * 30; // 30 dias -> ms
        const limitDate = new Date( Date.now() - expirationDate );

        try{
            const messages_delete = await MessageModel.deleteMany({
                timestamp: { $lt: limitDate },
                $or: [
                    { from: userA, to: userB },
                    { from: userB, to: userA }
                ]
            });

            console.log('-----------------------------------------------------------');
            console.log(`Expired messages deleted: ${messages_delete.deletedCount}`);
            console.log('-----------------------------------------------------------');
        }
        catch(error){
            console.error('Error at delete expired message', error);
        }
    }
};


module.exports = new MessagesExpiresService();