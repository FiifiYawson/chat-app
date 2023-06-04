const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const http = require("http")
const cors = require("cors")
require("dotenv").config()

const app = express()
const server = http.createServer(app)

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
    }
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use("/user", require("./routes/userRoutes.js"))
app.use("/messages", require("./routes/messageRoutes.js"))
app.use("/files", require("./routes/fileRoutes.js"))

//Handle MongoDB connections and minor setup. //
switch (process.env.NODE_ENV) {
    case "production":
        mongoose.connect(`${process.env.MONGO_ATLAS_URI}`).then(
            console.log("mongoose connected to mongoose atlas")
        ).catch((err) => {
            throw new Error(err)
        })

        app.use(express.static(path.join(__dirname, "../frontend/build")))

        app.get("*", (req, res) => {
            res.sendFile(path.join(__dirname, "../frontend/build/index.html"))
        })
        break

    case "development":
        mongoose.connect(`${process.env.MONGO_LOCAL_URI}`).then(
            console.log("mongoose connected locally")
        ).catch((err) => {
            throw new Error(err)
        })
        break

    default:
        throw new Error(`unknown NODE_ENV , ${process.env.NODE_ENV}`)
}

//Socket.io event listeners. //
io.on("connect", (socket) => {
    socket.on("userConnect", (connectObj) => {
        socket.data.userId = connectObj.user

        // join all user chat rooms //
        socket.join(connectObj.rooms)

        // join user room //
        socket.join(connectObj.user)

        // send online notification to all users in each chat room, only when user is not already logged in //
        connectObj.rooms.forEach(async room => {

            // if room user > 1 emit online with value true to room //
            if (await getRoomUserCount(room) > 1) io.to(room).emit("online", { room, value: true })
        })
    })

    socket.on("online", async ({ room }) => {
        // if number users in room is greater than 1 emit online with value true to that room //
        if (await getRoomUserCount(room) > 1) io.to(room).emit("online", { room, value: true })
    })

    socket.on("userDisconnect", () => {
        socket.disconnect()
    })

    socket.on("disconnecting", () => {
        socket.rooms.forEach(async room => {
            socket.leave(room)

            // if number of users in chat > 1 return //
            if (await getRoomUserCount(room) > 1) return

            io.to(room).emit("online", { room, value: false })
            io.to(room).emit("isTyping", { room, value: false })
        })
    })

    socket.on("message", (message) => {
        socket.to(message.chat).emit("message", message)
    })

    socket.on("createChat", async (chat) => {
        const senderSockets = await io.to(socket.data.userId).fetchSockets()
        const receiverSockets = await io.to(chat.user).fetchSockets()

        senderSockets.forEach(userSocket => userSocket.join(chat.chat))
        receiverSockets.forEach(socket => socket.join(chat.chat))

        socket.to(chat.chat).emit("createChat", chat)
    })

    socket.on("isTyping", (typing) => {
        socket.to(typing.room).emit("isTyping", typing)
    })

    socket.on("delete-text", (text) => {
        socket.to(text.chat).emit("delete-text", text)
    })
})

server.listen(process.env.PORT, console.log(`server running on port ${process.env.PORT}`))


// function to return all sockets connected to chat room, and also the number of active Users //
async function getRoomUserCount(room) {
    const roomSockets = await io.to(room).fetchSockets()

    const memoIds = new Set()

    let userCounts = 0

    for (let socket of roomSockets) {
        if (memoIds.has(socket.data.userId)) continue

        memoIds.add(socket.data.userId)

        userCounts++
    }

    return userCounts
}