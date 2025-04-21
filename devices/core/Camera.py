import cv2
from supervision import VideoInfo, get_video_frames_generator

class Camera:
    def __init__(self, camera_path = None):
        self.camera_path = camera_path

        if camera_path is None:
            raise ValueError("Camera path is required for camera object creation. My algorithm works on video_path")
        
        self._info = VideoInfo.from_video_path(camera_path)
        self._frames = get_video_frames_generator(camera_path)
        
    def get_frame(self):
        return self._frames