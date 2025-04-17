
const { DataTypes } = require('sequelize');
const Connection = require('../connection/connection');

const Campaign = Connection.define('Campaigns', {
    id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true
    },
    moderator_id: {
        type: DataTypes.CHAR(36),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
    }, {
        tableName: 'Campaigns',
        timestamps: false
    });

module.exports = Campaign;