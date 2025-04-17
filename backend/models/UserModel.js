
const { DataTypes } = require('sequelize');
const Connection = require('../connection/connection');

const User = Connection.define('Users', {
    id: {
        type: DataTypes.CHAR(36),
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
        allowNull: false
    },
    street: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    state: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    zip_code: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    profile_image_id: {
        type: DataTypes.STRING(24),
        allowNull: true
    }
}, {
    tableName: 'Users'
});

module.exports = User; // we can use in controller now...