const mongoose = require("mongoose")

const chat = mongoose.Schema({
    users: [mongoose.SchemaTypes.ObjectId],
    texts: [{
        text: String,
        sender: mongoose.SchemaTypes.ObjectId,
        time: Date,
    }, {
        timestamps: true,
    }]
})

module.exports = mongoose.model("chats", chat)