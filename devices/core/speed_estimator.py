from .speed.SpeedEstimator import SpeedEstimator
from .Camera import Camera

video_path = "E:/vehicle-speed-estimation/devices/resources/vehicles.mp4"
camera = Camera(camera_path=video_path)

speed_estimator = SpeedEstimator(camera._info)