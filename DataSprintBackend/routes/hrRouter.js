const express = require('express')
const userRouter = express.Router()
const auth = require('../middlewares/auth.js')
const {loginUser} = require('../controllers/hrController')

userRouter.post('/login',loginUser)

userRouter.use(auth);

module.exports = userRouter