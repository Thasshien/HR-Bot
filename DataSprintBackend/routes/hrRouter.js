const express = require('express')
const userRouter = express.Router()
const {leaveRequests, leaveApprovedRequests, assetMovements, getEmployees} = require('../controllers/hrController')

userRouter.get('/leave-requests',leaveRequests)
userRouter.get('/leave-approved-requests',leaveApprovedRequests)
userRouter.get('/asset-movements',assetMovements)
userRouter.get('/get-employees',getEmployees)

module.exports = userRouter