# import sys
# sys.path.append("../")

from tqdm import tqdm
from core.Camera import Camera
from core.speed.SpeedEstimator import SpeedEstimator
from core.speed.HandleOverDue import HandleOverDue

video_path = "E:/vehicle-speed-estimation/devices/resources/vehicles.mp4"
camera = Camera(camera_path=video_path)

print ("Video Infor: ", camera._info)

speed_estimator = SpeedEstimator(camera._info)        

handler = HandleOverDue()

for frame in tqdm(camera.get_frame(), desc="Processing video", total=camera._info.total_frames):
    annotated_frame = speed_estimator.run(frame)
    
    # Tiến hành duyệt thử và truy xuất tốc độ
    handler.update(speed_estimator._vehicle_speed)

speed_estimator._video_writer.close()