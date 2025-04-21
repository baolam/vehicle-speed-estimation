const vehicleModel = require("../models/VehicleModel");

class VehicleController {
  /**
   *
   * @param {*} req
   * @param {*} res
   * @description
   * Lấy danh sách phương tiện của một người dùng
   */
  async getAllVehicles(req, res) {
    try {
      const assgnCode = req.infor.assgnCode;
      const vehicleList = await vehicleModel.findAll({
        where: { assgnCode },
      });
      res.json(vehicleList);
    } catch (err) {
      res.status(500).json({ message: "Failed to retrieve list of vehicles" });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @description
   * Tạo một phương tiện mới
   */
  async createVehicle(req, res) {
    try {
      const assgnCode = req.infor.assgnCode;
      const { licensePlate } = req.body;

      const isExist = await vehicleModel.findOne({ where: { licensePlate } });
      if (isExist) {
        return res
          .status(400)
          .json({ message: "License plate already exists" });
      }

      vehicleModel.create({
        assgnCode,
        licensePlate,
      });

      res.json({ message: "Create vehicle successfully!" });
    } catch (err) {
      res.status(500).json({ message: "Failed to create vehicle" });
    }
  }
}

module.exports = VehicleController;
