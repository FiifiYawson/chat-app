const express = require("express")
const { createUser, deleteUser, loginUser, searchUser } = require("../controllers/userController.js")
const validate = require("../middleWare/validator.js")

const router = express.Router()

router.route("/register").post(createUser)
router.route("/login").post(loginUser)
router.route("/delete/:id").delete(validate, deleteUser)
router.route("/search/:query").get(validate, searchUser)

module.exports = router