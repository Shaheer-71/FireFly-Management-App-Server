const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    catagory: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: Object,
        url: {
            type: URL,
        },
        public_id: {
            type: URL,
        }
    }
}, {
    timestamps: true
});

module.exports = FeedbackModal = mongoose.model('userFeedback', feedbackSchema);

