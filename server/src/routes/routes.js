const userRoutes = require("./user.routes");
const vehicleRoutes = require("./vehicle.routes");
const adminRoutes = require("./admin.routes");
const deviceRoutes = require("./device.routes");

function assignRoute(app) {
  app.use("/api/user", userRoutes);
  app.use("/api/vehicle", vehicleRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/device", deviceRoutes);
}

module.exports = assignRoute;
