const mongoose = require("mongoose")

const user = mongoose.Schema({
    name: String,
    email_or_number: {
        type: String,
        unique: true,
        required: true,
    },
    chats: [mongoose.SchemaTypes.ObjectId],
    dob: Date,
    password: {
        type: String,
        required: true,
    },
    isOnline: Boolean,
})

module.exports = mongoose.model("users", user)