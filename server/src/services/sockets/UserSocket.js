const jwt = require("jsonwebtoken");
const events = require("events");

class UserSocket {
  constructor() {
    this.events = new events.EventEmitter();

    this.sockets = {};
    this._io = null;
  }

  /**
   *
   * @param {*} _io
   * @description
   * Gắn kết Io của user, mục tiêu xử lí
   */
  assgnIo(_io) {
    this._io = _io;
    _io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.Authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.PRIVATE_JWT_TOKEN);
        socket.infor = decoded;
        next();
      } catch (err) {
        socket.emit("authentication-failed");
        next(new Error("Invalid token!"));
      }
    });

    _io.on("connection", (socket) => {
      this.#onHandlingUser(socket);

      // Lắng nghe một số sự kiện thiết bị từ người dùn
      socket.on("device-infor-status", async (deviceCode) =>
        this.#onHandlingDeviceInforStatus(deviceCode, socket)
      );

      socket.on("request-device", (infor) =>
        this.#onHandlingRequestDevice(infor, socket)
      );

      socket.on("disconnect", () => {
        console.log("User disconnected");
        const { userId } = socket.infor;
        this.sockets[userId] = this.sockets[userId].filter(
          (item) => item.socketId !== socket.id
        );
        this.#onHandleDisconnectUser(socket);
      });
    });
  }

  async #onHandlingDeviceInforStatus(deviceCode, socket) {
    try {
      const deviceInfor = await this.#getManagement().getDeviceInfor(
        deviceCode
      );
      if (deviceInfor !== undefined) {
        socket.emit("device-infor-status", deviceInfor.socketId);
      } else {
        socket.emit("device-infor-status", null);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // #onHandlingRequestEnhancer(deviceId, socket) {
  //   console.log("Request enhancer infor!");
  //   this.#getManagement().sendDataToDevice(
  //     deviceId,
  //     "request-enhancer-infor",
  //     socket.id
  //   );
  // }

  // #onHandlingRequestSpeedEstimator(deviceId, socket) {
  //   console.log("Request speed estimator infor!");
  //   this.#getManagement().sendDataToDevice(
  //     deviceId,
  //     "request-speed-estimator-infor",
  //     socket.id
  //   );
  // }

  #onHandlingRequestDevice(infor, socket) {
    const { deviceId, event, additional } = infor;
    this.#getManagement().sendDataToDevice(deviceId, event, {
      additional,
      socketId: socket.id,
    });
  }

  #getManagement() {
    return require("../management/OnlineLookup");
  }

  #onHandlingUser(socket) {
    const { userId } = socket.infor;
    const infor = {
      socketId: socket.id,
      role: socket.infor.role,
    };

    if (this.sockets[userId] === undefined) {
      this.sockets[userId] = [];
    }

    this.sockets[userId].push(infor);
    this.events.emit("on-new-user", {
      userId,
      socketId: socket.id,
    });
  }

  #onHandleDisconnectUser(socket) {
    const infor = {
      socketId: socket.id,
      userId: socket.infor.userId,
    };
    this.events.emit("on-user-disconnected", infor);
  }
}

const userSocket = new UserSocket();
module.exports = userSocket;
