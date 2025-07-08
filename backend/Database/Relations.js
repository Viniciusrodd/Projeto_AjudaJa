
const UserModel = require('./models/UserModel');
const RequestModel = require('./models/RequestModel');
const OfferModel = require('./models/OfferModel');
const CampaignModel = require('./models/CampaignModel');
const NotificationModel = require('./models/NotificationsModel');

// Relations...

// 1 user can have many pedidos
UserModel.hasMany(RequestModel, { foreignKey: 'user_id' });
RequestModel.belongsTo(UserModel, { foreignKey: 'user_id' });


// 1 user can have many ofertas
UserModel.hasMany(OfferModel, { foreignKey: 'user_id' });
OfferModel.belongsTo(UserModel, { foreignKey: 'user_id' });


// 1 pedido can have many ofertas
RequestModel.hasMany(OfferModel, { foreignKey: 'request_id' });
OfferModel.belongsTo(RequestModel, { foreignKey: 'request_id' });


// 1 moderador (usuário) can have many campanhas
UserModel.hasMany(CampaignModel, { foreignKey: 'moderator_id' });
CampaignModel.belongsTo(UserModel, { foreignKey: 'moderator_id' });


// 1 user can have many notifications (User who's Receive Notifications)
UserModel.hasMany(NotificationModel, { foreignKey: 'user_id', as: 'receivedNotifications' });
NotificationModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'recipient' });


// 1 user can have many notifications (User who's Sent Notifications)
UserModel.hasMany(NotificationModel, { foreignKey: 'from_user_id', as: 'sentNotifications' });
NotificationModel.belongsTo(UserModel, { foreignKey: 'from_user_id', as: 'sender' });


// Exporting models centralizated
module.exports = {
    UserModel,
    RequestModel,
    OfferModel,
    CampaignModel,
    NotificationModel
};

// how get the model + relation at controllers:
// const { UserModel, RequestModel } = require('../relations');