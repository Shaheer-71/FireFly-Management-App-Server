const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    image: {
        type: String,
    },
    image_id: {
        type: String,
    },
    document: {
        type: String,
    },
    document_id: {
        type: String,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },

    createdAt: Date,

    user: {
        _id: mongoose.Schema.Types.ObjectId,
    }
});



module.exports = mongoose.model('messages', messageSchema);
