const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    idOccupdation: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Occupation'
    }
})

module.exports = mongoose.model('Tag', tagSchema)