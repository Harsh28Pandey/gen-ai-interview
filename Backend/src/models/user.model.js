const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already taken"],
        required: [true, "username is required"]
    },
    email: {
        type: String,
        unique: [true, "Account already exists with this email address"],
        required: [true, "email is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    }
}, { timestamps: true })

const userModel = mongoose.model("user", userSchema)

module.exports = userModel