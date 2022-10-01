const jwt = require("jsonwebtoken")

async function validate(req, res, next) {
    try {
        const auth = req.headers.authorization.split(" ")
        if (auth[0] === "Bearer") {
            const token = auth[1]

            req.payload = jwt.verify(token, process.env.SECRET)

            if (!req.payload) {
                res.staus(401).json({
                    message: "Unauthorized access",
                    isError: false,
                    isSuccess: false,
                })
            }

            next()
        }
    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: "Server Error",
            isSuccess: false,
            isError: true,
        })
    }

}

module.exports = validate