const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bookingSchema = new Schema({
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
    service: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type: String
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled"],
        default: "Pending"
    },
    is_Complete:{
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending"
    }
});

const bookingModel = mongoose.model("booking", bookingSchema);
module.exports = bookingModel
