import { AxiosResponse } from 'axios';
import axiosClient from '../../config/axiosClient';
import { ILoginInfo } from '../User/UserLogin';
import {
  IDeviceInfo,
  IDeviceListManagement,
  IUserManagement,
} from './admin.store';

export const onLoginUser = (infor: ILoginInfo) => {
  return new Promise<{ token: string }>((resolve, reject) => {
    axiosClient
      .post('/admin/login', infor)
      .then((resp: AxiosResponse<{ token: string }>) => resolve(resp.data))
      .catch((err) => reject(err));
  });
};

export const onGetAllUser = (page = 1) => {
  return new Promise<{ users: IUserManagement[]; totalPages: number }>(
    (resolve, reject) => {
      axiosClient
        .get(`/user/all?limit=${10}&page=${page}`)
        .then(
          (
            resp: AxiosResponse<{
              users: IUserManagement[];
              totalPages: number;
            }>
          ) => resolve(resp.data)
        )
        .catch((err) => reject(err));
    }
  );
};

export const getAllUser = () => {};

export const getAllDevices = (page = 1) => {
  return new Promise<{
    devices: IDeviceListManagement[];
    totalPages: number;
  }>((resolve, reject) => {
    axiosClient
      .get(`/device/all?limit=${10}&page=${page}`)
      .then(
        (
          resp: AxiosResponse<{
            devices: IDeviceListManagement[];
            totalPages: number;
          }>
        ) => resolve(resp.data)
      )
      .catch((err) => reject(err));
  });
};

export const getDetailDevice = (deviceCode: string) => {
  return new Promise<IDeviceInfo>((resolve, reject) => {
    axiosClient
      .get(`/device/detail/${deviceCode}`)
      .then((resp: AxiosResponse<IDeviceInfo>) => resolve(resp.data))
      .catch((err) => reject(err));
  });
};
