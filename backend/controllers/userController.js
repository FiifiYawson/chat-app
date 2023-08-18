const users = require("../models/userSchema.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

async function createUser(req, res) {
    let userDetails
    try {
        if (req.body.username?.trim().split(" ").length > 1) return res.status(400).json({
            message: "username cannot contain spaces",
            isSuccess: false,
        })

        if (new Date(req.body.dob) > new Date()) {
            return res.status(400).json({
                message: "date of birth is invalid",
                dob: req.body.dob
            })
        }

        const userExists = await users.exists({ username: req.body.username })

        if (userExists) {
            return res.status(400).json({
                message: "username already in user by another user",
                isSuccess: false,
            })
        }

        const salt = await bcrypt.genSalt()

        req.body.password = await bcrypt.hash(req.body.password, salt)

        userDetails = await users.create(req.body)

        if (!userDetails) {
            return res.status(400).json({
                message: "couldn't create user chat inputs",
                userDetails,
            })
        }

        const token = jwt.sign(JSON.stringify(userDetails), process.env.SECRET)

        res.status(200).json({
            message: "User created successfully",
            isSuccess: true,
            token,
            userDetails,
        })
    } catch (error) {
        console.log(error.message)

        if (userDetails) await users.deleteOne(req.body)

        res.status(500).json({
            message: "Server error",
            isSuccess: false,
        })
    }
}

async function loginUser(req, res) {
    try {
        const userDetails = await users.findOne({ username: req.body.username })

        if (userDetails && await bcrypt.compare(req.body.password, userDetails.password)) {
            const token = jwt.sign(JSON.stringify(userDetails), process.env.SECRET)

            res.status(200).json({
                message: "Log-in successful",
                isSuccess: true,
                token,
                userDetails,
            })
        } else {
            res.status(400).json({
                message: userDetails ? "Incorrect password" : "No user with this username",
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
        const searchResults = await users.find({
            $or: [{
                name: {
                    $regex: req.params.query,
                    $options: "i"
                },
            }, {
                username: {
                    $regex: req.params.query,
                    $options: "i"
                },

            }],
            _id: { $ne: req.userDetails._id }
        })

        res.json({
            searchResults,
        })
    } catch (error) {
        console.log(error.message)
    }
}

async function getUserDetails(req, res) {
    try {
        let projections = {};

        // if queried for specific attributes, fetch them //
        if (req.params[0] !== '') {
            const attributes = req.params[0].replace('/password', '');

            if (attributes !== '') {
                attributes.substring(1).split("/").forEach(attr => { projections[attr] = 1; });
            }
        } else {
            projections = {
                password: 0,
                __v: 0,
            };
        }

        const userDetails = await users.findById(req.params.id).select(projections);

        if (userDetails) {
            res.status(200).json({
                message: "query successful",
                userDetails,
                isSuccess: true,
            });
        } else {
            res.status(400).json({
                message: "user not found",
            });
        }
    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "server error",
        });
    }
}

async function editUserInfo(req, res) {
    try {
        if (req.body.username.trim().split(" ").length > 1) return res.status(400).json({
            message: "username cannot contain spaces",
            isSuccess: false,
        })

        // if there's a password, encrypt it //
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt())
        }

        // if there's a username, check if it's valid //
        if (req.body.username) {
            const notValid = await users.exists({
                username: req.body.username,
                _id: { $ne: req.userDetails._id }
            })

            if (notValid) {
                return res.status(400).json({
                    message: "username already in user by another user",
                    username: req.body.username,
                })
            }
        }

        const userDetails = await users.findByIdAndUpdate(req.userDetails._id, req.body)

        if (!userDetails) {
            return res.status(400).json({
                message: "error updating info, check inputs",
                inputs: req.body
            })
        }

        return res.status(200).json({
            message: "user updated successfully",
            userDetails: userDetails,
        })

    } catch (error) {
        console.log(error.message)

        return res.status(500).json({
            message: "server error",
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    deleteUser,
    searchUser,
    getUserDetails,
    editUserInfo,
}