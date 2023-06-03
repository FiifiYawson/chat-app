const mongoose = require("mongoose")
const userChat = require("./userChatSchema")
const text = require("./TextSchema")

const chat = mongoose.Schema({
    discription: {
        type: String,
    }
})

chat.pre("deleteOne", function () {
    userChat.deleteMany({ chat: this._id })
    text.deleteMany({ chat: this._id })
})

chat.pre("deleteMany", function () {
    userChat.deleteMany({ chat: this._id })
    text.deleteMany({ chat: this._id })
})

chat.pre("findByIdAndDelete", function () {
    userChat.deleteMany({ chat: this._id })
    text.deleteMany({ chat: this._id })
})

chat.pre("findOneAndDelete", function () {
    userChat.deleteMany({ chat: this._id })
    text.deleteMany({ chat: this._id })
})


module.exports = mongoose.model("chat", chat)