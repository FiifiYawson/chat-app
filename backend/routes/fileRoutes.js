const express = require("express")
const validate = require("../middleWare/validator")
const upload = require("../middleWare/multer")
const { addProfilePic, getProfilePic } = require("../controllers/fileController")

const router = express.Router()

router.route("/profilepic").post(validate, upload.single("profilepic"), addProfilePic)
router.route("/profilepic/:id").get(validate, getProfilePic)

module.exports = router