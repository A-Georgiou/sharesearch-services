const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        max: 2046,
        min: 8
    },
    date: {
        type: Date,
        default: Date.now()
    },
    favourites:{
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('User', userSchema);