const express = require('express')
const userRouter = express.Router()
const auth = require("../middlewares/auth")
const {askReq} = require('../controllers/rasaController')

userRouter.post('/ask',askReq);

module.exports = userRouter