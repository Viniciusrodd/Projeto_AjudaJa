
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    // _id já vem automático como ObjectId (24 caracteres)
    from:{
        type: String,
        required: true
    },
    to:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    timestamp:{
        type: Date,
        default: Date.now
    }
});

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;