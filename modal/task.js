const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: null
    },
    deadline: {
        type: Date,
        default: null
    },
    department: {
        type: String,
        required: true
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    attachments: {
        url: {
            type: String,
        },
        public_id: {
            type: String,
        }
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'on-hold'], // Predefined status values
        default: 'pending' // Default status value
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
