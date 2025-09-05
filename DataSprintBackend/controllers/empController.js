const empModel = require('../models/empModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const createToken = (id)=>{
    return jwt.sign( {id}, process.env.JWT_TOKEN_SECRET, { expiresIn: "1h" } )
}

const loginUser = async(req,res)=>{
    const {id,password} = req.body;
    console.log(req.body);

    try {
        const user = await empModel.findOne({id})
        if(!user)
            return res.status(400).json({"message":"Invalid id"})
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch)
            return res.status(400).json({"message":"Invalid pass"})
        const token = createToken(user.id)
        res.status(200).json({ token, name: user.name });
    } catch (error) {
        console.log(error)
        res.status(500).json({"message":"Internal Server Error"}) 
    }
}

const leaveReq = async (req, res) => {
  try {
    const id = req.user
    
    const emp = await empModel.findOne({ id: id }).select('leaveBalance');
    console.log("Found employee:", emp);
    if (!emp) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(emp.leaveBalance);
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


module.exports = {loginUser , leaveReq};