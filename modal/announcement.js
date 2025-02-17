const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'users',
    },
    date: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    time: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    title: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    message: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    attachment: {
        url: {
            type: String,
        },
        public_id: {
            type: String,
        }
    }
    
}, {
    timestamps: true
});

module.exports = ApplicationsModal = mongoose.model('announcements', announcementSchema);

