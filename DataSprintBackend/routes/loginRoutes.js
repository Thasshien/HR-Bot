const express = require('express')
const userRouter = express.Router()
const { login } = require('../controllers/loginController')

userRouter.post('/login',login);

module.exports = userRouter;