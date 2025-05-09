const UserModel = require("./UserModel");
const VehicleModel = require("./VehicleModel");
const DeviceModel = require("./DeviceModel");
const SpeedHistory = require("./SpeedHistoryModel");

/// Mối quan hệ giữa User và Vehicle
UserModel.hasMany(VehicleModel, {
  foreignKey: "assgnCode",
  // as: "vehicles",
});

VehicleModel.belongsTo(UserModel, {
  foreignKey: "assgnCode",
  // as: "user",
});

UserModel.hasMany(DeviceModel, {
  foreignKey: "assgnCode",
  // as: "devices",
});

DeviceModel.belongsTo(UserModel, {
  foreignKey: "assgnCode",
  // as: "user",
});

VehicleModel.hasMany(SpeedHistory, {
  foreignKey: "vehicleId",
});
