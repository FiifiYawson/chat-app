const jwt = require("jsonwebtoken")
const user = require("../models/userSchema")

async function validate(req, res, next) {
    try {
        if (!req.headers.authorization) return bounce(res);

        const auth = req.headers.authorization.split(" ")

        const token = auth[1]

        if (!token || !auth[0] === "Bearer") return bounce(res);

        const payload = jwt.verify(token, process.env.SECRET)

        if (!payload) return bounce();

        const userDetails = await user.findById(payload._id)

        if (!userDetails) {
            return res.status(400).json({
                message: "user not found"
            })
        }

        req.userDetails = userDetails

        next()

    } catch (err) {
        console.log(err.message)

        res.status(500).json({
            message: "Server Error",
            isSuccess: false,
            isError: true,
        })
    }
}

function bounce(res) {
    return res.status(401).json({
        message: "unauthorized access"
    })
}

module.exports = validate