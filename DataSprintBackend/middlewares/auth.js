const jwt = require('jsonwebtoken')
const authMiddleware = async (req, res, next) => {
  try {
    console.log("in auth")
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing or invalid format" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    console.log(decoded)
    req.user = decoded;

    next(); 
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware