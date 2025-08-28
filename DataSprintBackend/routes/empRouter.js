const express = require('express')
const userRouter = express.Router()
const {loginUser , leaveReq} = require('../controllers/empController')

userRouter.post('/login',loginUser);
userRouter.post('/leave',leaveReq);

module.exports = userRouter