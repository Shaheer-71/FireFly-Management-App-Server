const mongoose = require("mongoose")


const applyNowSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    dob: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        // enum: ['male', 'female', 'other'], // Add other genders or omit enum if you want it to be open-ended
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    coverletter: {
        type: String,
        trim: true,
        // default: null,
    },
    company: {
        type: String,
        trim: true,
    },
    currentjob: {
        type: String,
        trim: true,
    },
    degree: {
        type: String,
        trim: true,
    },
    field: {
        type: String,
        trim: true,
    },
    year: {
        type: String,
        trim: true,
    },
    cv: {
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

module.exports = ApplyNow = mongoose.model("jobapplications", applyNowSchema)