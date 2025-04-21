const UserModel = require("./UserModel");
const VehicleModel = require("./VehicleModel");
const DeviceModel = require("./DeviceModel");
const SpeedHistory = require("./SpeedHistoryModel");

require("./relation.models");

async function synchronize() {
  try {
    await UserModel.sync();
    await VehicleModel.sync();
    await DeviceModel.sync();
    await SpeedHistory.sync();
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
}

module.exports = synchronize;
