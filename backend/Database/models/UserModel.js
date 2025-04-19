
const { DataTypes } = require('sequelize');
const Connection = require('../Connection/connection');
const { v4: uuidv4 } = require('uuid');

const User = Connection.define('Users', {
    id: {
        type: DataTypes.CHAR(36),
        defaultValue: DataTypes.UUIDV4, // generating random uuid with lib 'uuid'
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('usuario', 'moderador'),
        allowNull: false,
        defaultValue: 'usuario'
    },
    street: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: ''
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: ''
    },
    state: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: ''
    },
    zip_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: ''
    },
    profile_image_id: {
        type: DataTypes.STRING(24),
        allowNull: true
    }
}, {
    tableName: 'Users'
});

module.exports = User; // we can use in controller now...