const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Access Denied");
  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_JWT_TOKEN);
    req.infor = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid Token");
  }
}

module.exports = authenticateToken;
