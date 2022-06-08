const jwt = require("jsonwebtoken")

async function validate(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1]

        req.payload = jwt.verify(token, process.env.SECRET)

        if (!req.payload) {
            res.staus(401).json({
                message: "Unauthorized access",
                isError: false,
                isSuccess: false,
            })
        }
    } catch (err) {
        console.log(err)

        res.status(500).res.json({
            message: "Server Error",
            isSuccess: false,
            isError: true,
        })
    }

    next()
}

module.exports = validate