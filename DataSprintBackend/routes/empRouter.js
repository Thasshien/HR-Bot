const express = require('express')
const userRouter = express.Router()
const {loginUser} = require('../controllers/empController')

userRouter.post('/login',loginUser)

module.exports = userRouter