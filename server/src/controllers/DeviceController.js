const shortid = require("shortid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const deviceModel = require("../models/DeviceModel");
const userModel = require("../models/UserModel");
const onlineManagement = require("../services/management/OnlineLookup");

class DeviceController {
  /**
   *
   * @param {*} req
   * @param {*} res
   * @description
   * Tiến hành đăng ký thiết bị mới, chức năng của Admin
   * @returns
   */
  async onRegister(req, res) {
    try {
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @description
   * Tiến hành đăng nhập ở thiết bị
   * @returns
   */
  async onLogin(req, res) {
    try {
      const { password, deviceCode } = req.body;
      const device = (
        await deviceModel.findOne({ where: { deviceCode } })
      ).toJSON();
      if (!bcrypt.compareSync(password, device.password)) {
        return res.status(401).json({ message: "Invalid secret key" });
      }
      const token = jwt.sign({ id: device.id }, process.env.PRIVATE_JWT_TOKEN, {
        expiresIn: process.env.JWT_DEVICE_EXPIRES_IN,
      });

      return res.status(200).json({
        message: "Login successfully",
        token,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Problem with login" });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @description
   * Trả về danh sách các thiết bị hiện có
   * @returns
   */
  async onGetAllDevice(req, res) {
    try {
      const { limit, page } = req.query;
      if (!limit || !page) {
        return res.status(400).json({ message: "Invalid query!" });
      }

      const { count, rows } = await deviceModel.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
        include: [userModel],
      });

      const devices = rows.map((device) => {
        const tmp = device.toJSON();
        return {
          deviceCode: tmp.deviceCode,
          userId: tmp.user.id,
          name: tmp.user.name,
          street: tmp.street,
        };
      });

      res.json({ devices, totalPages: Math.ceil(count / limit) });
    } catch (err) {
      res.status(500).json({ message: "Error fetching devices" });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @description
   * Lấy thông tin thiết bị chi tiết
   * @returns
   */
  async onGetDetail(req, res) {
    try {
      const { deviceCode } = req.params;
      const device = (
        await deviceModel.findOne({
          where: { deviceCode },
        })
      ).toJSON();
      const message = {
        deviceCode: device.deviceCode,
        street: device.street,
        online:
          (await onlineManagement.getDeviceInfor(device.deviceCode)) !==
          undefined,
      };
      res.json(message);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error fetching device" });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @description
   * Lấy danh sách toàn bộ thiết bị gắn với 1 người dùng cụ thể
   */
  async onGetAllDeviceUserId(req, res) {
    try {
      const { userId } = req.infor;
      const raw_data = await deviceModel.findAll({
        where: {
          assgnCode: userId,
        },
      });

      const data = await Promise.all(
        raw_data.map(async (raw) => {
          return {
            ...raw.toJSON(),
            password: undefined,
            online:
              (await onlineManagement.getDeviceInfor(raw.deviceCode)) !==
              undefined,
          };
        })
      );

      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Unexpected error!" });
    }
  }
}

module.exports = DeviceController;
