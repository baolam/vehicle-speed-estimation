const { Sequelize } = require("sequelize");

const Database = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

module.exports = Database;