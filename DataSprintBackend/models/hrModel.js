const mongoose = require('mongoose');

const hrSchema = new mongoose.Schema({
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
    }
});

module.exports = mongoose.model('HR', hrSchema);