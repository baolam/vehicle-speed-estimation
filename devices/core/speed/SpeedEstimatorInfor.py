import os
import json
import numpy as np

class SpeedEstimatorInfor:
    CONFIG_FILE = "config/speed_estimator.json"

    def __init__(self):
        self._record_changed()
    
    @property
    def track_method(self):
        return self._config['track_method']
    
    @property
    def polygon_zone(self):
        polygon_zone = self._config["polygon_zone"]
        temp = [
            polygon_zone["tl"],
            polygon_zone["tr"],
            polygon_zone["bl"],
            polygon_zone["br"]
        ]
        return np.array(temp)
    
    @property
    def target(self):
        actual_length = self._config["actual_length"]
        target_width = actual_length["width"]
        target_height = actual_length["height"]
        temp = [
            [0, 0],
            [target_width - 1, 0],
            [target_width - 1, target_height - 1],
            [0, target_height - 1]
        ]
        return np.array(temp)
    
    @property
    def confidence_threshold(self):
        return self._config["detections"]["confidence_threshold"]

    @property
    def accp_classes(self):
        temp = self._config["detections"]["accepted_classes"]
        return np.array(temp)

    @property
    def nms_method(self):
        return self._config["detections"]["nms_method"]
    
    @property
    def should_write_video(self):
        return self._config["write_video"]["should"]
    
    @property
    def output_video_path(self):
        return self._config["write_video"]["folder_path"]
    
    @property
    def fps_video(self):
        return self._config["write_video"]["fps"]
    
    @property
    def duration_video(self):
        return self._config["write_video"]["duration"]
    
    @property
    def video_width(self):
        return self._config["write_video"]["width"]
    
    @property
    def video_height(self):
        return self._config["write_video"]["height"]
    
    @property
    def overall_video(self):
        return self._config["write_video"]
    
    @property
    def max_frame(self):
        return self._config["limited_frame"]
    
    @property
    def total_trackers(self):
        return self._config["total_trackers"]
    
    @property
    def min_takes(self):
        return self._config["min_takes"]
    
    def _record_changed(self):
        if not os.path.exists(self.CONFIG_FILE):
            raise FileNotFoundError(f"Config file {self.CONFIG_FILE} not found")
        with open(self.CONFIG_FILE, 'rb') as f:
            self._config = json.load(f)