const express = require("express")
const validate = require("../middleWare/validator.js")
const { getUserChats, sendMessage, createChat } = require("../controllers/chatsController.js")

const router = express.Router()

router.route("/:id").post(validate, createChat)
router.route("/").get(validate, getUserChats)
router.route("/send/:id").post(validate, sendMessage)

module.exports = router