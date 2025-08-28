const mongoose = require('mongoose');

const empSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    leavesLeft: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('EMP', empSchema);