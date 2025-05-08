
const { DataTypes } = require('sequelize');
const Connection = require('../Connection/connection');
const { v4: uuidv4 } = require('uuid');


const Request = Connection.define('Requests', {
    id: {
        type: DataTypes.CHAR(36),
        defaultValue: DataTypes.UUIDV4, // generating random uuid with lib 'uuid'
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
        type: DataTypes.ENUM(
            'alimentos',
            'roupas_calçados',
            'transporte',
            'serviços_gerais',
            'apoio_emocional',
            'moradia_abrigo',
            'educação',
            'trabalho_renda',
            'saúde_remédios',
            'animais',
            'tecnologia',
            'livre'
        ),
        allowNull: false,
        defaultValue: 'livre'
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