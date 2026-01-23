const mongoose = require("mongoose");
const Schema = mongoose.Schema

const reviewSchema = new Schema({
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
    rating: {
        type: Number,
        min: 1, max: 5
    },
    comment: {
        type: String
    },
    image: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
}, {
    timestamps: true
});

const reviewModel = mongoose.model("review", reviewSchema);
module.exports = reviewModel;
