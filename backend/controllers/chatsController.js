const chats = require("../schemas/chatSchema.js")
const users = require("../schemas/userSchema.js")

//Gather and send all chats of a user. //
async function getUserChats(req, res) {
    try {
        const userChats = []

        const user = await users.findById(req.payload._id)

        if (user.chats.length === 0) {
            res.status(200).json({
                message: "request successful",
                chats: [],
                isSuccess: true,
                isError: false,
            })
        }

        user.chats.forEach(async(id) => {
            const chat = await chats.findById(id)

            userChats.push(chat)

            if (userChats.length === user.chats.length) {
                res.status(200).json({
                    message: "request successful",
                    chats: userChats || [],
                    isSuccess: true,
                    isError: false,
                })
            }
        });

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "server error",
            isSuccess: false,
            isError: true,
        })
    }
}

//Send text to chat. //
async function sendMessage(req, res) {
    try {
        const chat = await chats.findById(req.params.id)

        await chat.texts.push(req.body)

        await chat.save()

        res.status(200).json({
            message: "message sent",
            isSuccess: true,
            isError: false,
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "server error",
            isError: true,
            isSuccess: false,
        })
    }
}

//Creat a chat between user. //
async function createChat(req, res) {
    try {
        const user1 = await users.findOne({ email_or_number: req.params.id })
        const user2 = await users.findById(req.payload._id)

        if (user1) {
            req.body.users = [{
                name: user1.name,
                email_or_number: user1.email_or_number,
                _id: user1._id,
            }, {
                name: user2.name,
                email_or_number: user2.email_or_number,
                _id: user2._id,
            }]

            await chats.create(req.body)

            const chat = await chats.findOne(req.body)

            await user2.chats.push(chat._id)
            await user2.save()

            await user1.chats.push(chat._id)
            await user1.save()

            res.status(200).json({
                message: "chat created",
                isSuccess: true,
                isError: false,
                chat,
            })
        } else {
            res.status(400).json({
                message: "user not found",
                isSuccess: false,
                isError: false,
            })
        }
    } catch (error) {
        console.log(error)

        await chats.deleteOne(req.body)

        res.status(500).json({
            message: "sever error",
            isError: true,
            isSuccess: false,
        })
    }
}

module.exports = {
    getUserChats,
    sendMessage,
    createChat,
}