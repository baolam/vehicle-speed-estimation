const userModel = require("../models/UserModel");

function retrieveAssignCode(req, res, next) {
  if (req.infor === undefined || req.infor === null) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  userModel
    .findOne({ where: { id: req.infor.userId } })
    .then((user) => {
      if (user === null) {
        return res.status(404).json({ message: "User not found" });
      }
      const assgnCode = user.toJSON().assgnCode;
      req.infor = { ...req.infor, assgnCode };
      next();
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    });
}

module.exports = retrieveAssignCode;
