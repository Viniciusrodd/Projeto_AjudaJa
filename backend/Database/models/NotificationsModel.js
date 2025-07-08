
const { DataTypes } = require('sequelize');
const Connection = require('../Connection/connection');
const { v4: uuidv4 } = require('uuid');


const Notification = Connection.define('Notifications', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // generating random uuid with lib 'uuid'
        primaryKey: true
    },
    user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false
    },
    from_user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
    }, {
        tableName: 'notifications',
        timestamps: false
});


module.exports = Notification;