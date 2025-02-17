const mongoose = require('mongoose');

const applicationsSchema = new mongoose.Schema({
    submitted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    name: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    subject: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
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

module.exports = ApplicationsModal = mongoose.model('userApplications', applicationsSchema);

