async function test() {
  await require("../src/models/sync.models");
  const userModel = require("../src/models/UserModel");
  const deviceModel = require("../src/models/DeviceModel");
  const vehicleModel = require("../src/models/VehicleModel");

  const test1 = await userModel.findOne({
    where: {
      username: "KimTuyet_Phan87",
    },
    include: [deviceModel, vehicleModel],
  });

  if (test1) {
    console.log(test1.toJSON());
  } else {
    console.log("CHưa có dữ liệu!");
  }
}

test();
