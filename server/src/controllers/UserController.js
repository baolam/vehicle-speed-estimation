const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");

const userModel = require("../models/UserModel");
const vehicleModel = require("../models/VehicleModel");
const deviceModel = require("../models/DeviceModel");

class UserController {
  /**
   *
   * @param {*} req
   * @param {*} res
   * @description
   * Lấy toàn bộ người dùng
   */
  async getAllUsers(req, res) {
    try {
      const { limit, page } = req.query;
      if (!limit || !page) {
        return res.status(400).json({ message: "Invalid query" });
      }

      const { count, rows } = await userModel.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
      });

      const users = rows.map((user) => {
        const tmp = user.toJSON();
        return {
          id: tmp.id,
          name: tmp.name,
          role: tmp.userRole,
          username: tmp.username,
        };
      });

      res.json({ users, totalPages: Math.ceil(count / limit) });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @description
   * Gán vai trò cho người dùng
   */
  async assignRole(req, res) {
    try {
      const { username, role } = req.body;
      if (role !== "admin" && role !== "normal" && role !== "police") {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await userModel.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      userModel.update(
        {
          userRole: role,
        },
        {
          where: { username },
        }
      );

      res.json({ message: "Role assigned successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Error assigning role" });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @description
   * Lấy thông tin người dùng gồm role và id
   * @returns
   */
  async getUserInfo(req, res) {
    try {
      const { userId, role } = req.infor;
      const user = (
        await userModel.findOne({ where: { id: userId } })
      ).toJSON();
      res.json({
        name: user.name,
        role,
      });
    } catch (err) {
      return res.status(500).json({ message: "Error fetching user info" });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @description
   * Lấy chi tiết thông tin người dùng
   * @returns
   */
  async getDetail(req, res) {
    try {
      const { userId } = req.infor;
      const infor = (
        await userModel.findOne({
          where: { id: userId },
          include: [deviceModel, vehicleModel],
        })
      ).toJSON();
      infor.vehicles = infor.vehicles.map((vehicle) => ({
        ...vehicle,
        assgnCode: undefined,
      }));
      infor.devices = infor.devices.map((device) => ({
        ...device,
        assgnCode: undefined,
        password: undefined,
      }));
      infor.password = undefined;
      res.json(infor);
    } catch (err) {
      // console.log(err);
      return res.status(500).json({ message: "Error fetching user info" });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @description
   * Đăng nhập
   * @returns
   */
  async logIn(req, res) {
    try {
      const { username, password } = req.body;
      const user = await userModel.findOne({
        where: {
          username,
        },
      });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
      const token = jwt.sign(
        { userId: user.id, role: user.userRole },
        process.env.PRIVATE_JWT_TOKEN,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );
      res.json({ token });
    } catch (err) {
      return res.status(500).json({ message: "Error logging in" });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @description
   * Đăng ký người dùng
   */
  async register(req, res) {
    try {
      const { username, password, name } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 10);

      const isExist = await userModel.findOne({
        where: {
          username,
        },
      });
      if (isExist) {
        return res.status(400).json({ message: "Username is already exist" });
      }

      userModel.create({
        username,
        password: hashedPassword,
        name,
        userRole: "normal",
        id: shortid.generate(),
        // assgnCode: shortid.generate(),
      });
      res.json({ message: "User created successfully" });
    } catch (err) {
      res.status(400).json({ message: "Failed to create user" });
    }
  }
}

module.exports = UserController;
