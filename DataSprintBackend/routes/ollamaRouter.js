const express = require('express')
const userRouter = express.Router()
const {askReq} = require('../controllers/ollamaController')

userRouter.post('/ask',askReq);

module.exports = userRouter