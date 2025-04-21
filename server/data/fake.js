const XLSX = require("xlsx");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { fakerVI } = require("@faker-js/faker");

const faker = fakerVI;
const workbook = XLSX.utils.book_new();

function writeFile(data, sheet_name) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheet_name);
}

const generateRole = () => {
  const roles = ["admin", "normal", "police"];
  const role = roles[Math.floor(Math.random() * roles.length)];
  return role;
};

const generateOneUser = () => {
  return {
    id: shortid.generate(),
    username: faker.internet.username(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
    userRole: generateRole(),
  };
};

const generateLicensePlate = () => {
  const letters = faker.string.alpha(2).toUpperCase();
  const convinces = faker.string.numeric({
    length: 2,
    allowLeadingZeros: true,
  });
  const firstPart = faker.string.numeric({
    length: 3,
    allowLeadingZeros: true,
  });
  const secondPart = faker.string.numeric({
    length: 2,
    allowLeadingZeros: true,
  });
  return `${convinces}-${letters} ${firstPart}.${secondPart}`;
};

const generateOneVehicle = (userId) => {
  return {
    licensePlate: generateLicensePlate(),
    assgnCode: userId,
    vehicleType: faker.vehicle.vehicle(),
    manufacturer: faker.vehicle.manufacturer(),
  };
};

const generateOneDevice = (userId) => {
  return {
    deviceCode: shortid.generate(),
    password: shortid.generate(),
    assgnCode: userId,
    street: faker.location.street(),
  };
};

async function generateInfor() {
  await require("../src/models/sync.models")();
  console.log("Đồng bộ CSDL thành công!");

  const userModel = require("../src/models/UserModel");
  const deviceModel = require("../src/models/DeviceModel");
  const vechicleModel = require("../src/models/VehicleModel");

  const totalUsers = 100;
  const numDevices = 5;
  const numVehicles = 3;

  const users = [];
  const devices = [];
  const vehicles = [];

  for (let i = 0; i < totalUsers; i++) {
    const user = generateOneUser();
    await userModel.create({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    });
    users.push(user);

    if (user.userRole === "police") {
      for (let j = 0; j < numDevices; j++) {
        const device = generateOneDevice(user.id);
        await deviceModel.create({
          ...device,
          password: bcrypt.hashSync(device.password, 10),
        });
        devices.push(device);
      }
    }
    const vehicle = generateOneVehicle(user.id);
    await vechicleModel.create(vehicle);
    vehicles.push(vehicle);
    console.log("Hoàn thành tạo một user: ", i + 1);
  }

  console.log("Viết file dữ liệu!");
  writeFile(users, "users");
  writeFile(vehicles, "vehicles");
  writeFile(devices, "devices");
  XLSX.writeFile(workbook, "data.xlsx");
}

generateInfor();
