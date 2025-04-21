const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/UserModel");
const deviceModel = require("../models/DeviceModel");

class AdminController {
  /**
   *
   * @param {*} req
   * @param {*} res
   * @description
   * Đăng nhập với vai trò Admin
   * @returns
   */
  async onLogin(req, res) {
    const { username, password } = req.body;
    const user = await userModel.findOne({
      where: {
        username,
        userRole: "admin",
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign(
      { userId: user.id, role: user.userRole },
      process.env.PRIVATE_JWT_TOKEN,
      {
        expiresIn: process.env.JWT_ADMIN_EXPIRES_IN,
      }
    );
    return res.json({ token });
  }
}

module.exports = AdminController;
