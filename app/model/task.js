const mongoose = require('mongoose')
const Schema = mongoose.Schema


const TaskSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceProvider",
        required: true
    },
    timeSlots: {
        type: [String]
    },
    status: {
        type: String,
        enum: ['pending', 'complete'],
        default: 'pending',
    },
}, {
    timestamps: true
})

const TaskModel = mongoose.model('task', TaskSchema)
module.exports = TaskModel