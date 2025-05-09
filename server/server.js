const http = require("http");
const express = require("express");
const ip = require("ip");
const socketio = require("socket.io");
const dotenv = require("dotenv");
const morgan = require("morgan");

const app = express();
const server = http.createServer(app);

// Kết nối với .env
dotenv.config();

const PORT = process.env.PORT || 3000;
const ADDR = `http://${ip.address()}:${PORT}`;

const cors = require("cors");
const path = require("path");

/// Cài đặt một số middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(express.static(__dirname + "/src/build"));

/// Cài đặt các route
require("./src/routes/routes")(app);

// Cài đặt giao diện
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "src", "build", "index.html"));
});

/// Cài đặt socket.io
const io = new socketio.Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  maxHttpBufferSize: 1e6,
});
const userIo = io.of("/socket/user");
const deviceIo = io.of("/socket/device");

/// Tiến hành assign xử lí tương ứng
require("./src/services/sockets/UserSocket").assgnIo(userIo);
require("./src/services/sockets/DeviceSocket").assgnIo(deviceIo);

/// Tiến hành quản lí các kết nối qua socket
require("./src/services/management/OnlineLookup");

server.listen(PORT, async () => {
  /// Tiến hành kết nối Database
  await require("./src/models/sync.models")();
  console.log(`Server is running on ${ADDR}`);
  console.log(`Server is listening on port ${PORT}`);
});
