
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ajuda_ja')
    .then(() =>{
        console.log('MongoDB database connected');
    }).catch((error) => console.log('Error in connection with MongoDB database', error));


module.exports = mongoose;