const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passcode: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    fcmToken: {
        type: [String],
        default: []
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    address: {
        type: String
    },
    contact: {
        type: String
    },
    department: {
        type: String
    },
    dob: {
        type: String
    },
    emergency_contact: {
        type: String
    },
    experience: {
        type: String
    },
    gender: {
        type: String
    },
    joining: {
        type: String
    },
    nationality: {
        type: String
    },
    posession: {
        type: String
    },
    status: {
        type: String
    }
}, {
    timestamps: true
});

const RegisterModal = mongoose.model('users', registerSchema);

module.exports = RegisterModal;
