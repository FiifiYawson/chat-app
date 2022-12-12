const users = require("../schemas/userSchema.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

async function createUser(req, res) {
    try {
        const userExists = await users.exists({ email_or_number: req.body.email_or_number })

        if (userExists) {
            res.status(400).json({
                message: "Phone number or E-mail is already used by another user",
                isSuccess: false,
                isError: false,
            })
        } else {
            const salt = await bcrypt.genSalt()

            req.body.password = await bcrypt.hash(req.body.password, salt)

            await users.create(req.body)

            let user = await users.findOne(req.body)

            const token = await jwt.sign(JSON.stringify(user), process.env.SECRET)

            res.status(200).json({
                message: "User created successfully",
                isSuccess: true,
                isError: false,
                token,
                userId: user._id
            })
        }
    } catch (error) {
        console.log(error)

        await users.deleteOne(req.body)

        res.status(500).json({
            message: "Server error",
            isSuccess: false,
            iSError: true,
        })
    }
}

async function loginUser(req, res) {
    try {
        const user = await users.findOne({ email_or_number: req.body.email_or_number })

        if (user && await bcrypt.compare(req.body.password, user.password)) {
            const token = await jwt.sign(JSON.stringify(user), process.env.SECRET)

            res.status(200).json({
                message: "Log-in successful",
                isSuccess: true,
                token,
                userId: user._id,
            })
        } else {
            res.status(400).json({
                message: user ? "Incorrect password" : "No user with this phone number or E-mail",
                isSuccess: false,
                isError: false,
            })
        }
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "server error",
            isError: true,
            isSuccess: false,
        })
    }
}

async function deleteUser(req, res) {
    try {
        const valid = req.payload._id === req.params.id

        valid ? await users.findByIdAndDelete(req.params.id) : res.status(401).json({
            message: "unauthorized access",
            isSuccess: false,
            isError: false,
        })

        res.status(200).json({
            message: "user deleted successfully",
            isSuccess: true,
            isError: false,
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "server error, user not deleted",
            isSuccess: false,
            isError: true,
        })
    }
}

async function searchUser(req, res) {
    try {
        const searchUsers = await users.find({
            $and: [{
                $or: [{
                    name: {
                        $regex: req.params.query,
                        $options: "i"
                    },
                }, {
                    email_or_number: {
                        $regex: req.params.query,
                        $options: "i"
                    },

                }]
            }, {
                _id: { $ne: req.payload._id }
            }]
        })

        res.json({
            searchUsers,
        })

    } catch (error) {
        console.log(error.message)
    }

}

module.exports = {
    createUser,
    loginUser,
    deleteUser,
    searchUser
}