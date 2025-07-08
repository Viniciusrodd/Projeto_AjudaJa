
// databases
const MessagesModel = require('../mongoDatabase/Collections/Messages');
const NotificationModel = require('../Database/models/NotificationsModel');


// controller
class chatController{
    // historical messages
    async messagesBetweenUsers(req, res){
        const loggedUserId = req.user.id; // from token
        const userId = req.params.userID;

        if(!loggedUserId || !userId){
            return res.status(400).send({
                error: 'Bad request at necessary user datas'
            });
        }

        try{
            const messages = await MessagesModel.find({
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


    // get notifications
    async findNotification(req, res){
        try{
            const notification_data = await NotificationModel.findAll();
            if(notification_data.length === 0){
                return res.status(204).send({
                    noContent: `There's no notifications data...` 
                });
            }

            return res.status(200).send({
                msg: 'Notifications find with success',
                notification_data
            });
        }
        catch(error){
            console.error('Internal server error at find notifications', error);
            return res.status(500).send({
                msgError: 'Internal server error at find notifications',
                details: error.response?.data || error.message
            });
        }
    };


    // delete notification (read)
    async deleteNotification(req, res){
        const userId = req.params.userID;
        if(!userId){
            return res.status(400).send({
                emptyParams: 'Bad request, need send user id params...'
            });
        }

        try{
            const notification_data = await NotificationModel.findAll({ 
                where: {user_id: userId} 
            });
            if(!notification_data){
                return res.status(404).send({ error: 'Notification not found' });
            }

            await NotificationModel.destroy({ 
                where: {user_id: userId} 
            });
            return res.status(200).send({ msg: 'Notification deleted successfully' });
        }
        catch(error){
            console.error('Internal server error at delete notifications', error);
            return res.status(500).send({
                msgError: 'Internal server error at delete notifications',
                details: error.response?.data || error.message
            });
        }
    };
}

module.exports = new chatController();