const mongoose = require("mongoose");

const userChat = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true,
    },
    chatRef: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    },
    chat: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'chat',
        required: true,
    },
    title: {
        type: String,
        trim: true,
    },
    isPrivate: {
        type: Boolean,
        default: true,
    }
})

module.exports = mongoose.model('userChat', userChat);