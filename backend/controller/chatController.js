
const Messages = require('../mongoDatabase/Collections/Messages');

class chatController{
    async messagesBetweenUsers(req, res){
        const loggedUserId = req.user.id; // from token
        const userId = req.params.userID;

        if(!loggedUserId || !userId){
            return res.status(400).send({
                error: 'Bad request at necessary user datas'
            });
        }

        try{
            const messages = await Messages.find({
                $or: [
                    { from: loggedUserId, to: userId },
                    { from: userId, to: loggedUserId }
                ]
            }).sort({ timestamp: 1 }); // data order...

            return res.status(200).send({
                msg: 'Success get chat record data',
                messages
            });
        }
        catch(error){
            console.error('Internal server error at Messages between users handler', error);
            return res.status(500).send({
                msgError: 'Internal server error at Messages between users handler',
                details: error.response?.data || error.message
            });
        }
    };
}

module.exports = new chatController();