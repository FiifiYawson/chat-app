const chats = require("../schemas/chatSchema.js")
const users = require("../schemas/userSchema.js")

async function getUserChats(req, res) {
    try {
        const user = await users.findById(req.params.id)
        const userChats = []

        user.chats.forEach(id => {
            const chat = chats.findById(id).then(userChats.push(chat)).catch((err) => console.log(err.message))
        });

        if (user) {
            res.status(200).json({
                message: "request successful",
                chats: userChats,
                isSuccess: true,
                isError: false,
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

        res.status(500).json({
            message: "server error",
            isSuccess: false,
            isError: true,
        })
    }
}

async function sendMessage(req, res) {
    try {
        chat = await chats.findById(req.params.id)

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

async function createChat(req, res) {
    try {
        req.body.users = [req.payload._id, req.params.id]

        await chats.create(req.body)

        const chat = await chats.findOne(req.body)

        const user2 = await users.findById(req.body.users[1])
        await user2.chats.push(chat._id)
        await user2.save()

        const user1 = await users.findById(req.body.users[0])
        await user1.chats.push(chat._id)
        await user1.save()

        res.status(200).json({
            message: "chat created",
            isSuccess: true,
            isError: false,
        })
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