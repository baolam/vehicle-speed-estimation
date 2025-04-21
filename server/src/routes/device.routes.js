const express = require("express");
const Router = express.Router();

const DeviceController = require("../controllers/DeviceController");
const deviceController = new DeviceController();

const authenticate = require("../middlewares/authenticate");
const isAdmin = require("../middlewares/isAdmin");

Router.post("/register", authenticate, isAdmin, deviceController.onRegister);
Router.post("/login", deviceController.onLogin);
Router.get("/all", authenticate, isAdmin, deviceController.onGetAllDevice);
Router.get("/detail/:deviceCode", authenticate, deviceController.onGetDetail);

module.exports = Router;
