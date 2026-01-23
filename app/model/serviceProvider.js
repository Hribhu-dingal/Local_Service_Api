const mongoose = require("mongoose");
const Schema = mongoose.Schema

const ServiceProviderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "service",
        required: true
    }],
    location: {
        type: String
    },
    availability: [{
        days: {
            type: [String]
        },
        slots: {
            type: [String]
        }
    }],
    price: {
        type: Number
    },
    rating: {
        type: Number,
        default: 0
    },
    image: {
        type: String
    },
},{
    timestamps: true
});

const ServiceProviderModel = mongoose.model("ServiceProvider", ServiceProviderSchema)
module.exports = ServiceProviderModel