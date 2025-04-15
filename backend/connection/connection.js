
const sequelize = require('sequelize');

const connection = new sequelize(
    'ajuda_ja', 
    'root', 
    'bravogamessempre123', {
        host: 'localhost',
        dialect: 'mysql',
        timezone: '-03:00'
    }
);

module.exports = connection;