const userModel = require('../models/user.model.js')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")
const tokenBlacklistModel = require("../models/blacklist.model.js")

/**
 * @name registerUserController
 * @description register a new user, expects username, email or password
 * @access Public
*/
const registerUserController = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password",
            success: false
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account is already exists with this email address or username",
            success: false
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hashPassword
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)

    return res.status(201).json({
        message: "User created successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
*/
const loginUserController = async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)
    return res.status(200).json({
        message: "User logged in successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
*/
const logoutUserController = async (req, res) => {
    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token")
    return res.status(200).json({
        message: "User logged out successfully",
        success: true
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access Private
*/
const getMeController = async (req, res) => {
    const user = await userModel.findById(req.user.id)

    return res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}