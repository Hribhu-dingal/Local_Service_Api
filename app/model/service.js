const mongoose = require('mongoose')
const Schema = mongoose.Schema


const serviceSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const serviceModel = mongoose.model('service', serviceSchema)
module.exports = serviceModel