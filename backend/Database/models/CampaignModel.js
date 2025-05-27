
const { DataTypes } = require('sequelize');
const Connection = require('../Connection/connection');
const { v4: uuidv4 } = require('uuid');


const Campaign = Connection.define('Campaigns', {
    id: {
        type: DataTypes.CHAR(36),
        defaultValue: DataTypes.UUIDV4, // generating random uuid with lib 'uuid'
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
        allowNull: false
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