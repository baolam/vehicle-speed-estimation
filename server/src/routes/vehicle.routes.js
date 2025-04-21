const express = require("express");
const Router = express.Router();

const authenticate = require("../middlewares/authenticate");
const retrieveAssgnCode = require("../middlewares/retrieveAssigncode");

const VechicleController = require("../controllers/VehicleController");
const vehicleController = new VechicleController();

Router.get(
  "/",
  authenticate,
  retrieveAssgnCode,
  vehicleController.getAllVehicles
);

Router.post(
  "/",
  authenticate,
  retrieveAssgnCode,
  vehicleController.createVehicle
);

module.exports = Router;
