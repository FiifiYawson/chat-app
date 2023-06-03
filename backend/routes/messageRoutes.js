const express = require("express")
const validate = require("../middleWare/validator.js")
const upload = require("../middleWare/multer")
const {
    getUserChats,
    sendMessage,
    createChat,
    readChat,
    deleteText,
    deleteChat,
    getSingleChat,
} = require("../controllers/chatsController.js")

const router = express.Router()

router.route("/create-chat/:id").post(validate, createChat)
router.route("/").get(validate, getUserChats)
router.route("/:id").get(validate, getSingleChat)
router.route("/read-chat/:id").get(validate, readChat)
router.route("/send").post(upload.none(), validate, upload.array("attachment"), sendMessage)
router.route("/delete-text/:id").delete(validate, deleteText)
router.route("delete-chat/:id").delete(validate, deleteChat)

module.exports = router