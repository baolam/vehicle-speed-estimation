const jwt = require("jsonwebtoken");
const events = require("events");

const deviceModel = require("../../models/DeviceModel");

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

      socket.on("disconnect", () => {
        console.log("Device disconnected");
        this.events.emit("on-disconnect-device", {
          userId: socket.infor,
          socketId: socket.id,
        });
        this.sockets[socket.infor] = undefined;
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
    console.log(this.#getManagement());
    this.#getManagement().sendDataToUser(socketId, event, result);
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
