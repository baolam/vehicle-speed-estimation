import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { onGetUserDetail } from './user.api';

export interface IUserInfo {
  name: string;
  role: string;
}

export interface IDeviceInfo {
  id: number;
  deviceCode: number;
}

export interface IDeviceUser {
  id: number;
  deviceCode: string;
  street: string;
  createdAt: Date;
  updatedAt: Date;
  online: boolean;
}

export interface IVechicleInfo {
  id: number;
  licensePlate: string;
  vehicleType: string;
  manufacturer: string;
}

export interface IUserDetail {
  devices: IDeviceInfo[];
  vehicles: IVechicleInfo[];
  id: string;
  name: string;
  userRole: string;
  username: string;
}

export interface IUserInfoState {
  user: IUserInfo;
  initalizeStatus: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  userDetail: IUserDetail;
  deviceSelected: {
    deviceCode: string;
  };
}

export const retrieveUserInfo = createAsyncThunk<IUserDetail>(
  'user/initalize',
  async () => {
    const response = await onGetUserDetail();
    return response;
  }
);

const initialState = {
  user: {
    name: '',
    role: 'normal',
  },
  initalizeStatus: {
    status: 'idle',
    error: null,
  },
  userDetail: {
    devices: [] as IDeviceInfo[],
    vehicles: [] as IVechicleInfo[],
    id: '',
    name: '',
    userRole: '',
    username: '',
  },
  deviceSelected: {
    deviceCode: '',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutAction: (state) => ({
      ...state,
      user: {
        name: '',
        role: 'normal',
      },
    }),
    updateVehicle: (state, action: PayloadAction<IVechicleInfo>) => ({
      ...state,
      userDetail: {
        ...state.userDetail,
        vehicles: [...state.userDetail.vehicles, action.payload],
      },
    }),
    updateChoosenDevice: (state, action: PayloadAction<string>) => ({
      ...state,
      deviceSelected: {
        ...state.deviceSelected,
        deviceCode: action.payload,
      },
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveUserInfo.pending, (state) => ({
        ...state,
        initalizeStatus: {
          ...state.initalizeStatus,
          status: 'loading',
        },
      }))
      .addCase(
        retrieveUserInfo.fulfilled,
        (state, action: PayloadAction<IUserDetail>) => ({
          ...state,
          userDetail: action.payload,
          user: {
            name: action.payload.name,
            role: action.payload.userRole,
          },
          initalizeStatus: {
            status: 'succeeded',
            error: null,
          },
        })
      );
  },
});

export const { logoutAction, updateVehicle, updateChoosenDevice } =
  userSlice.actions;
export default userSlice.reducer;
