const mongoose = require("mongoose")

const user = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    bio: String,
    username: {
        type: String,
        required: true,
        unique: true,
    },
    dob: {
        type: Date,
        required: true,
        validate: {
            validator: function (date) {
                const now = new Date()
                const dob = new Date(date)

                return dob <= now
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

user.virtual("names").get(function () {
    return this.name.split(" ")
})

module.exports = mongoose.model("user", user)