const express = require("express")
const authController = require("../controllers/auth.controller.js")
const authMiddleware = require("../middlewares/auth.middleware.js")

const authrouter = express.Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
*/
authrouter.post("/register", authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description login a user with email and password
 * @access Public
*/
authrouter.post("/login", authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear cookie, clear token from user cookie and add token in blacklist
 * @access Public
*/
authrouter.get("/logout", authController.logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access Private
*/
authrouter.get("/get-me", authMiddleware.authUser, authController.getMeController)

module.exports = authrouter 