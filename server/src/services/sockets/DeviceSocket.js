const jwt = require("jsonwebtoken");
const events = require("events");

const deviceModel = require("../../models/DeviceModel");
const Vehicle = require("../../models/VehicleModel");
const SpeedHistoryModel = require("../../models/SpeedHistoryModel");

class DeviceSocket {
  constructor() {
    this.events = new events.EventEmitter();

    this.sockets = {};
    this._io = null;
  }

  /**
   *
   * @param {*} _io
   * @description
   * Gắn kết Io của device, mục tiêu xử lí
   */
  assgnIo(_io) {
    this._io = _io;
    _io.use(async (socket, next) => this.#__onAuthenticate(socket, next));

    _io.on("connection", (socket) => {
      socket.on("response-user", (data) => this.#onHandlingResponseUser(data));

      socket.on("streaming", (hotImg) =>
        this.#onHandlingStreamingImage(hotImg, socket)
      );

      socket.on("overspeed", async (infor) =>
        this.#onHandlingOverSpeed(infor, socket)
      );

      socket.on("disconnect", () => {
        console.log("Device disconnected");
        this.events.emit("on-disconnect-device", {
          userId: socket.infor,
          socketId: socket.id,
        });

        delete this.sockets[socket.infor.userId];
      });
    });
  }

  #__onCheckDeviceExisted(decoded) {
    const keys = Object.keys(this.sockets);

    for (let i = 0; i < keys.length; i++) {
      const infors = this.sockets[this.sockets[keys[i]]];
      for (let j = 0; j < infors.length; j++) {
        if (infors[j].deviceId === decoded.id) {
          return true;
        }
      }
    }

    return false;
  }

  #onHandlingResponseUser(data) {
    const { result, event, socketId } = data;
    this.#getManagement().sendDataToUser(socketId, event, result);
  }

  /**
   *
   * @param {*} hotImg
   * @param {*} socket
   * @description
   * Stream kết quả trực tiếp từ thiết bị lên giao diện
   * @returns
   */
  #onHandlingStreamingImage(hotImg, socket) {
    const { userId } = socket.infor;
    const onlineUsers = this.#getManagement().getUserSocket(userId);
    // console.log(onlineUsers);
    if (onlineUsers === undefined) return;

    for (let i = 0; i < onlineUsers.length; i++) {
      const { socketId } = onlineUsers[i];
      this.#getManagement().sendDataToUser(socketId, "streaming", hotImg);
    }
  }

  async #onHandlingOverSpeed(infor, socket) {
    const { licensePlate, speed, time, embed_img } = infor;
    const { userId, deviceId } = socket.infor;

    try {
      const vehicleInfor = (
        await Vehicle.findOne({
          where: { licensePlate },
        })
      ).toJSON();

      const vehicleId = vehicleInfor.id;

      /// Thêm vào lịch sử tốc độ phương tiện
      await SpeedHistoryModel.create({
        vehicleId,
        deviceId,
        userId,
        time,
        speed,
        embed_img,
      });

      /// Gửi thông báo đến user qua kết nối (cài đặt ở điện thoại)
      console.log("Còn thực hiện ở đây!");
    } catch (err) {
      console.log("Biển số chưa được đăng ký!");
    }
  }

  /**
   *
   * @param {*} socket
   * @param {*} next
   * @description
   * Tiến hành xác thực socket kết nối
   * @returns
   */
  async #__onAuthenticate(socket, next) {
    try {
      const token = socket.handshake.auth.Authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.PRIVATE_JWT_TOKEN);

      if (this.#__onCheckDeviceExisted(decoded)) {
        return next(new Error("Device is already connected"));
      }

      await this.#__getUserManagement(socket, decoded);
      next();
    } catch (err) {
      socket.emit("authentication-failed");
      next(new Error("Invalid token!"));
    }
  }

  /**
   *
   * @param {*} socket
   * @param {*} infor
   * @description
   * Tiến hành lấy người xử lí tương ứng với thiết bị
   */
  #__getUserManagement(socket, infor) {
    const deviceId = infor.id;
    return new Promise(async (resolve, reject) => {
      try {
        const device = (
          await deviceModel.findOne({ where: { id: deviceId } })
        ).toJSON();

        const infor = {
          userId: device.assgnCode,
          deviceId: device.id,
          socketId: socket.id,
        };

        socket.infor = infor;
        if (this.sockets[device.assgnCode] === undefined) {
          this.sockets[device.assgnCode] = [];
        }
        this.sockets[device.assgnCode].push(infor);

        /// Phát sự kiện
        this.events.emit("on-new-device", infor);

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  #getManagement() {
    return require("../management/OnlineLookup");
  }
}

const deviceSocket = new DeviceSocket();
module.exports = deviceSocket;
