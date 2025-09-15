const express = require('express')
const userRouter = express.Router()
const {leaveReq , maternityLeaveReq , reqAsset} = require('../controllers/empController')

userRouter.post('/apply-leave',leaveReq);
userRouter.post('/apply-leave-maternity',maternityLeaveReq);
userRouter.post('/request-asset',reqAsset);


module.exports = userRouter