const express = require('express')
const userRouter = express.Router()
const auth = require("../middlewares/auth")
const {loginUser , leaveReq} = require('../controllers/empController')

userRouter.post('/login',loginUser);

userRouter.use(auth)

userRouter.post('/leave',leaveReq);

module.exports = userRouter