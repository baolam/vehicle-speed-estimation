const Device = require("../sockets/DeviceSocket");
const User = require("../sockets/UserSocket");

const deviceModel = require("../../models/DeviceModel");
const userModel = require("../../models/UserModel");

class OnlineLookup {
  constructor() {
    // this._device = Device;
    // this._user = User;

    Device.events.addListener("on-new-device", this.#onHandlingNewDevice);
    User.events.addListener("on-new-user", this.#onHandlingNewUser);
    Device.events.addListener(
      "on-disonnect-device",
      this.#onHandlingDisconnectDevice
    );
  }

  /**
   *
   * @param {*} infor
   * @description
   * XỬ lí khi có thiết bị kết nối tới và người dùng phụ trách cũng online
   */
  #onHandlingNewDevice(infor) {
    console.log("Device infor: ", infor);

    const { userId } = infor;
    const onlineUsers = User.sockets[userId];

    if (onlineUsers) {
      onlineUsers.forEach(({ socketId }) => {
        User._io.to(socketId).emit("device-connected");
      });
    }
  }

  /**
   *
   * @param {*} infor
   * @description
   * Xử lí khi có người dùng kết nối tới
   */
  #onHandlingNewUser(infor) {
    console.log("User infor: ", infor);

    const { userId, socketId } = infor;
    const onlineDevices = Device.sockets[userId];
    if (onlineDevices) {
      User._io.to(socketId).emit("device-connected", onlineDevices);
    }
  }

  /**
   *
   * @param {*} infor
   * @description
   * Xử lí phần thiết bị mất kết nối
   */
  #onHandlingDisconnectDevice(infor) {
    console.log("Disconnect");
    const { userId } = infor;
    const onlineUsers = User.sockets[userId];
    if (onlineUsers) {
      onlineUsers.forEach(({ socketId }) => {
        User._io.to(socketId).emit("device-disconnected", infor.socketId);
      });
    }
  }

  getDeviceSocket(userId) {
    return Device.sockets[userId];
  }

  async getDeviceInfor(deviceCode) {
    const deviceInfor = (
      await deviceModel.findOne({
        where: { deviceCode },
        include: [userModel],
      })
    ).toJSON();

    const userId = deviceInfor.user.id;
    const infors = this.getDeviceSocket(userId);
    const wanna = infors.find((infor) => infor.deviceId === deviceInfor.id);

    return wanna;
  }

  sendDataToDevice(deviceSocket, event, data = null) {
    console.log(
      `Try to send event '${event}' to device with socketId: ${deviceSocket} and data: ${data}`
    );
    // console.log(Device._io.to(deviceSocket));
    if (data != null) Device._io.to(deviceSocket).emit(event, data);
    else Device._io.to(deviceSocket).emit(event);
  }

  sendDataToUser(userSocket, event, data = null) {
    console.log(
      `Try to send event '${event}' to user with socketId: ${userSocket} and data: ${data}`
    );
    if (data != null) User._io.to(userSocket).emit(event, data);
    else User._io.to(userSocket).emit(event);
  }

  getAllDeviceSockets() {
    return Device.sockets;
  }

  getUserSocket(userId) {
    return User.sockets[userId];
  }

  getAllUserSockets() {
    return User.sockets;
  }
}

const lookup = new OnlineLookup();
module.exports = lookup;
