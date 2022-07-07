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
app.use(cors())
app.use("/user", require("./routes/userRoutes.js"))
app.use("/messages", require("./routes/messageRoutes.js"))

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

    case "developement":
        mongoose.connect(`${process.env.MONGO_LOCAL_URI}`).then(
            console.log("mongoose connected locally")
        ).catch((err) => {
            throw new Error(err)
        })
        break

    default:
        throw new Error(`unknown NODE_ENV , ${process.env.NODE_ENV}`)
}

io.on("connect", (socket) => {
    try {
        socket.on("userConnect", (connectObj) => {

            console.log("user connect")


            connectObj.rooms.forEach(room => {
                socket.join([room, connectObj.user])

                if (io.sockets.adapter.rooms.get(room).size > 1) {
                    io.to(room).emit("online", { room, value: true })
                }
            })
        })

        socket.on("userDisconnect", (payload) => {
            console.log("disconnected")
            payload.rooms.forEach(room => {
                io.to(room).emit("online", { room, value: false })

                socket.leave(room)
            })
        })

        socket.on("message", (message) => {
            socket.to(message.room).emit("message", message)
        })

        socket.on("creatChat", ({ receiver, chat, room }) => {
            socket.join(room)

            if (io.sockets.adapter.rooms.get(receiver)) {
                io.sockets.adapter.rooms.get(receiver).forEach(socket => socket.join(room))

                socket.to(room).emit("createChat", chat)
            }
        })

        socket.on("isTyping", (typing) => {
            socket.to(typing.room).emit("isTyping", typing)
        })

    } catch (error) {
        console.log(error.message)
    }
})

server.listen(process.env.PORT, console.log(`server running on port ${process.env.PORT}`))