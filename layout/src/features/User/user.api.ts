import { AxiosResponse } from 'axios';
import axiosClient from '../../config/axiosClient';
import { IDeviceUser, IUserDetail, IUserInfo } from './user.store';
import { ILoginInfo } from './UserLogin';
import { IUserRegisterInfo } from './UserRegister';
// import { getDetailDevice } from '../Admin/admin.api';

export const onLoginUser = (infor: ILoginInfo) => {
  return new Promise<{ token: string }>((resolve, reject) => {
    axiosClient
      .post('/user/login', infor)
      .then((resp: AxiosResponse<{ token: string }>) => resolve(resp.data))
      .catch((err) => reject(err));
  });
};

export const onRegister = (infor: IUserRegisterInfo) => {
  return new Promise((resolve, reject) => {
    axiosClient
      .post('/user/register', infor)
      .then((resp) => resolve(resp))
      .catch((err) => reject(err));
  });
};

export const onRetrieveUserInfo = () => {
  return new Promise<IUserInfo>((resolve, reject) => {
    axiosClient
      .get('/user')
      .then((resp: AxiosResponse<IUserInfo>) => resolve(resp.data))
      .catch((err: unknown) => reject(err));
  });
};

export const onGetUserDetail = () => {
  return new Promise<IUserDetail>((resolve, reject) => {
    axiosClient
      .get('/user/detail')
      .then((resp: AxiosResponse<IUserDetail>) => resolve(resp.data))
      .catch((err) => {
        reject(err);
      });
  });
};

export const createVehicle = () => {
  return new Promise((resolve, reject) => {
    axiosClient
      .post('/vehicle')
      .then((resp) => resolve(resp))
      .catch((err) => reject(err));
  });
};

export const onGetVehicleList = () => {};

export const onGetAllDevice = () => {
  return new Promise<IDeviceUser[]>((resolve, reject) => {
    axiosClient
      .get('/device/all/user')
      .then((resp: AxiosResponse<IDeviceUser[]>) => resolve(resp.data))
      .catch((err) => reject(err));
  });
};

// export const onGetDeviceDetail = (deviceCode: string) => {
//   return getDetailDevice(deviceCode);
// };
