const express = require("express")
const { createUser, deleteUser, loginUser } = require("../controllers/userController.js")
const validate = require("../middleWare/validator.js")

const router = express.Router()

router.route("/register").post(createUser)
router.route("/login").post(loginUser)
router.route("/delete/:id").delete(validate, deleteUser)

module.exports = router