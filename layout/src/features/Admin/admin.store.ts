import { createSlice } from '@reduxjs/toolkit';

export interface IUserManagement {
  id: number;
  name: string;
  role: string;
  username: string;
}

export interface IDeviceManagement {
  deviceCode: string;
}

export interface IDeviceListManagement {
  deviceCode: string;
  userId: string;
  name: string;
  street: string;
}

export interface IDeviceInfo {
  deviceCode: string;
  street: string;
  online: boolean;
}

export interface IAdminState {
  userSelected: IUserManagement;
  deviceSelected: IDeviceManagement;
}

interface GammaInfor {
  skip: boolean;
  gamma: number;
}

interface AdjustGeneral {
  skip: boolean;
  brightness: number;
  contrast: number;
}

interface Sharpen {
  skip: boolean;
}

export interface IEnhancerMethod {
  skip_enhancement: boolean;
  gamma_infor: GammaInfor;
  adjust_general: AdjustGeneral;
  sharpen: Sharpen;
}

interface TrackMethod {
  track_activation_threshold: number;
  lost_track_buffer: number;
  minimum_matching_threshold: number;
  frame_rate: number;
  minimum_consecutive_frames: number;
}

interface PolygonZone {
  tl: [number, number];
  tr: [number, number];
  bl: [number, number];
  br: [number, number];
}

interface ActualLength {
  width: number;
  height: number;
}

interface NmsMethod {
  threshold: number;
  class_agnostic: boolean;
}

interface Detections {
  confidence_threshold: number;
  accepted_classes: number[];
  nms_method: NmsMethod;
}

interface WriteVideo {
  should: boolean;
  folder_path: string;
}

export interface ISpeedEstimatorMethod {
  total_trackers: number;
  track_method: TrackMethod;
  limited_frame: number;
  polygon_zone: PolygonZone;
  actual_length: ActualLength;
  detections: Detections;
  write_video: WriteVideo;
  min_takes: number;
}

const initialState: IAdminState = {
  userSelected: {
    id: 0,
    name: '',
    role: '',
    username: '',
  },
  deviceSelected: {
    deviceCode: '',
  },
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
});

export default adminSlice.reducer;
