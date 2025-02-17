const mongoose = require("mongoose")


const bonusSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    role: {
        type: String,
        required: true
    },
    justification: {
        type: String,
    },
},{
    timestamps: true
})

module.exports = BonusModal = mongoose.model("bonus", bonusSchema)