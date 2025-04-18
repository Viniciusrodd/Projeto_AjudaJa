
const { DataTypes } = require('sequelize');
const Connection = require('../Connection/connection');

const Offer = Connection.define('Offers', {
    id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false
    },
    request_id: {
        type: DataTypes.CHAR(36),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pendente', 'aceito', 'rejeitado'),
        allowNull: false,
        defaultValue: 'pendente'
    }
    }, {
        tableName: 'Offers',
        timestamps: false
    });
  
module.exports = Offer;