const Database = require("../config/database");
const { DataTypes } = require("sequelize");

const SpeedHistoryModel = Database.define("speed_history", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    references: {
      model: "vehicles",
      key: "id",
    },
  },
  userId: {
    type: DataTypes.STRING,
    references: {
      model: "users",
      key: "id",
    },
  },
  deviceId: {
    type: DataTypes.INTEGER,
    references: {
      model: "devices",
      key: "deviceCode",
    },
  },
  time: {
    type: DataTypes.DATE,
  },
  speed: {
    type: DataTypes.DECIMAL(10, 2),
  },
});

module.exports = SpeedHistoryModel;
