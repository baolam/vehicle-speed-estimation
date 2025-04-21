const { DataTypes } = require("sequelize");
const Database = require("../config/database");

const Vehicle = Database.define("vehicle", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  assgnCode: {
    type: DataTypes.STRING,
    references: {
      model: "users",
      key: "id",
    },
  },
  licensePlate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  vehicleType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Vehicle;
