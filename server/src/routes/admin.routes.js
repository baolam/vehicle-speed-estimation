const express = require("express");
const Router = express.Router();

const AdminController = require("../controllers/AdminController");
const adminController = new AdminController();

Router.post("/login", adminController.onLogin);

module.exports = Router;
