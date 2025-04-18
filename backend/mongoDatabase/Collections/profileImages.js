
const mongoose = require('mongoose');

const ProfileImageSchema = new mongoose.Schema({
    // _id já vem automático como ObjectId (24 caracteres)

    image_data: {
        type: Buffer,
        required: true
    },
    content_type: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const ProfileImage = mongoose.model('ProfileImage', ProfileImageSchema);

module.exports = ProfileImage;