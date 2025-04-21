const { DataTypes } = require("sequelize");
const Database = require("../config/database");

const Device = Database.define("device", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  deviceCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    /// Chuỗi dùng để chứng thực thiết bị
    type: DataTypes.STRING,
    allowNull: false,
  },
  assgnCode: {
    type: DataTypes.STRING,
    references: {
      model: "users",
      key: "id",
    },
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Device;
