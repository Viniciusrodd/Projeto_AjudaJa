
const { DataTypes } = require('sequelize');
const Connection = require('../connection/connection');

const Request = Connection.define('Requests', {
    id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    urgency: {
        type: DataTypes.ENUM('baixa', 'media', 'alta'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('aberto', 'fechado'),
        allowNull: false,
        defaultValue: 'aberto'
    },
    latitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true
    },
    longitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
    }, {
        tableName: 'Requests',
        timestamps: false
    });
  
module.exports = Request;