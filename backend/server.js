const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
require("dotenv").config()

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use("/user", require("./routes/userRoutes.js"))
app.use("/messages", require("./routes/messageRoutes.js"))

switch (process.env.NODE_ENV) {
    case "production":
        mongoose.connect(`${process.env.MONGO_ATLAS_URI}`).then().catch((err) => {
            throw new Error(err)
        })

        app.use(express.static(path.join(__dirname, "../frontend/build")))

        app.get("*", (req, res) => {
            res.sendFile(path.join(__dirname, "../frontend/build/index.html"))
        })
        break

    case "developement":
        mongoose.connect(`${process.env.MONGO_LOCAL_URI}`).then().catch((err) => {
            throw new Error(err)
        })
        break

    default:
        throw new Error(`unknown NODE_ENV , ${process.env.NODE_ENV}`)
}

app.listen(process.env.PORT, console.log(`listening on port ${process.env.PORT}`))