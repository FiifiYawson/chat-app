const mongoose = require("mongoose")

const chat = mongoose.Schema({
    users: [Object],
    texts: [{
        text: String,
        sender: mongoose.SchemaTypes.ObjectId,
        time: Date,
    }, {
        timestamps: true,
    }],
})

module.exports = mongoose.model("chats", chat)