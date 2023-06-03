const chats = require("../models/chatSchema.js")
const userChats = require("../models/userChatSchema")
const texts = require("../models/TextSchema")
const mongoose = require("mongoose")

const conn = mongoose.connection

conn.once("connected", () => {
    attachment = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "attachment"
    })
})

async function getSingleChat(req, res) {
    const chat = await userChats.find({
        chat: req.params.id,
        user: req.userDetails._id
    })

    if (!chat) return res.status(400).json({
        message: "chat not found"
    })

    return res.status(200).json({ chat })
}

//Gather and send all chats of a user. //
async function getUserChats(req, res) {
    try {
        const userChat = await userChats.find({ user: req.userDetails._id })

        res.status(200).json({
            message: "request successful",
            chats: userChat,
            isSuccess: true,
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "server error",
            isSuccess: false,
        })
    }
}

async function sendMessage(req, res) {
    try {
        const chat = await chats.exists({ _id: req.body.chat })

        if (!chat) {
            return res.status(400).json({
                message: "chat not found"
            })
        }

        if (req.files) req.body.attachments = [...req.files]
        req.body.sender = req.userDetails._id

        const text = await texts.create(req.body)

        if (!text) {
            if (req.files) attachment.deleteMany({ $or: req.files })

            return res.status(400).json({
                message: "error sending text, check inputs",
                text,
            })
        }

        return res.status(200).json({
            message: "text sent successfully",
            text,
        })
    } catch (error) {
        console.log(error)

        // in case of any errors, delete attachments of files //
        if (req.files) attachment.deleteMany({ $or: req.files })

        res.status(500).json({
            message: "server error",
            isSuccess: false,
        })
    }
}

// create private chat between two users //
async function createChat(req, res) {
    let createdChats
    let chat
    try {
        chat = await chats.create({});

        const invalid = await userChats.exists({
            $or: [{
                user: req.params.id,
                chatRef: req.userDetails._id
            }, {
                chatRef: req.userDetails._id,
                user: req.params.id
            }]
        })

        if (invalid) return res.status(400).json({
            message: "chat already exists"
        })

        // create userChats for each chat user //
        createdChats = await userChats.create([{
            user: req.params.id,
            chatRef: req.userDetails._id,
            chat: chat._id,
        }, {
            user: req.userDetails._id,
            chatRef: req.params.id,
            chat: chat._id,
        }])

        if (!createdChats) {
            return res.status(400).json({
                message: "error creating account, check inputs",
            })
        }

        return res.status(200).json({
            message: "chat created successfully",
            chats: createdChats,
            isSuccess: true,
        })
    } catch (error) {
        console.log(error.message)

        if (chat) await chats.deleteOne(chat)

        res.status(500).json({
            message: "sever error",
            isSuccess: false,
        })
    }
}

async function readChat(req, res) {
    try {
        const chat = await chats.exists({ _id: req.params.id })

        if (!chat || !req.params.id) return res.status(400).json({
            message: "chat not found"
        })

        const chatTexts = await texts.find({ chat: req.params.id })

        if (!chatTexts) return res.status(400).json({
            message: "error encountered while reading chat",
        })

        return res.status(200).json({
            message: "chat read successfully",
            texts: chatTexts,
        })
    } catch (error) {
        console.log(error.message)

        res.status(500).json({
            message: "server error"
        })
    }

}

async function deleteText(req, res) {
    try {
        const text = await texts.findById(req.params.id)

        if (!text) {
            return res.status(400).json({
                message: "text not found",
            })
        }

        if (!text.sender.equals(req.userDetails._id)) {
            return res.status(401).json({
                message: "you are not the sender of this text",
            })
        }

        const deleted = await texts.deleteOne(text)

        if (!deleted) {
            return res.status(500).json({
                message: "error occured while deleting text"
            })
        }

        return res.status(200).json({
            message: "text deleted successfully",
            text,
        })
    } catch (error) {
        console.log(error.message)

        res.status(500).json({
            message: "server error"
        })
    }
}

async function deleteChat(req, res) {
    res.send("chat deleted")
}

module.exports = {
    getUserChats,
    sendMessage,
    createChat,
    readChat,
    deleteText,
    getSingleChat,
    deleteChat,
}