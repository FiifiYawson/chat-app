const express = require("express")
const validate = require("../middleWare/validator.js")
const {
    createUser,
    deleteUser,
    loginUser,
    searchUser,
    getUserDetails,
    editUserInfo,
} = require("../controllers/userController.js")

const router = express.Router()

router.route("/register").post(createUser)
router.route("/login").post(loginUser)
router.route("/delete/:id").delete(validate, deleteUser)
router.route("/search/:query").get(validate, searchUser)
router.route("/user-details/:id*").post(validate, getUserDetails)
router.route("/edit-details").post(validate, editUserInfo)

module.exports = router