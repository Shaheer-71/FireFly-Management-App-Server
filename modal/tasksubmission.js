const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSubmissionSchema = new Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tasks",
        required: true
    },
    repoLink: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        default: null
    },
    attachments: {
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

const TaskSubmission = mongoose.model('TaskSubmission', taskSubmissionSchema);

module.exports = TaskSubmission;
