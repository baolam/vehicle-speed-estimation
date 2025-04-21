import os
import numpy as np
import cv2
from supervision import VideoSink, VideoInfo
from datetime import datetime

class WriteVideo():
    format_datetime = "_%H_%M_%S_%d_%m_%Y_"
    
    def __init__(self, folder_path : str, video_info : VideoInfo, *args, **kwargs):
        # Tổng số khung là số thời gian (s) * số fps
        self.__video_info = video_info
        self.__folder = folder_path
        self._continue_status = 0
        
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
        
        # Tiến hành khởi tạo
        self._initalize_video()

    def _initalize_video(self):
        now = datetime.now()

        file_name = f"video{now.strftime(self.format_datetime)}.mp4"
        file_path = f"{self.__folder}/{file_name}"
        
        self.__current_frame = 1
        self.__video = VideoSink(file_path, self.__video_info)
        self.__video = self.__video.__enter__()
        
    def write_frame(self, frame : np.ndarray):
        if self.__current_frame == self.__video_info.total_frames + 1:
            self.__video.__exit__(None, None, None)
            self._initalize_video()

        # Có thể kèm thêm một số phương pháp xử lí trước
        resized_frame = cv2.resize(frame, (self.__video_info.width, self.__video_info.height))

        self.__video.write_frame(resized_frame)
        self.__current_frame += 1

    def close(self):
        self.__video.__exit__(None, None, None)