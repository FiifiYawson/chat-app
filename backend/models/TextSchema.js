const mongoose = require("mongoose");

const text = new mongoose.Schema({
    chat: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'chat',
        required: [true, "provide a chat reference for this text"]
    },
    content: {
        type: String,
    },
    attachments: Array,
    sender: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        immutable: true,
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('text', text);