import numpy as np
import cv2
import math

from collections import defaultdict
from typing import List
from supervision import Position
from supervision import Detections, ByteTrack, PolygonZone
from supervision import BoxAnnotator, LabelAnnotator
from supervision import FPSMonitor, VideoInfo
from ultralytics import YOLO

from ..image.EnhancerTool import EnhancerTool
from ..utils.Cache import LFU
from .SpeedEstimatorInfor import SpeedEstimatorInfor
from .WriteVideo import WriteVideo

class _ViewTransformer:
    def __init__(self, source: np.ndarray, target: np.ndarray) -> None:
        source = source.astype(np.float32)
        target = target.astype(np.float32)
        self.m = cv2.getPerspectiveTransform(source, target)

    def transform_points(self, points: np.ndarray) -> np.ndarray:
        if points.size == 0:
            return points

        reshaped_points = points.reshape(-1, 1, 2).astype(np.float32)
        transformed_points = cv2.perspectiveTransform(reshaped_points, self.m)
        return transformed_points.reshape(-1, 2)


class SpeedEstimator:
    model = YOLO("model/yolo11s.pt")
    infor = SpeedEstimatorInfor()

    def __init__(self, video_infor : VideoInfo):
        self._enhancer = EnhancerTool()
        
        # Cài đặt bộ khung thuật toán
        self._fps_monitor = FPSMonitor()
        self._byte_track = ByteTrack(**self.infor.track_method)
        self._polygon_zone = PolygonZone(polygon=self.infor.polygon_zone)
        self._view_transformer = _ViewTransformer(source=self.infor.polygon_zone, target=self.infor.target)
        
        # Lấy thực FPS này để tiến hành tính toán tốc độ
        self._fps_ratio = video_infor.fps

        # Dùng để quản lí những tracker id bị dư thừa
        self._cache = LFU(self.infor.total_trackers)
        self._coordinates = defaultdict(dict)
        self._vehicle_speed = defaultdict(float)

        # Cài đặt hiển thị thông tin ở ảnh
        self._bd_box_annotator = BoxAnnotator(thickness=2)
        self._label_annotator = LabelAnnotator(text_scale=2, text_thickness=2)

        # Khởi tạo lớp viết Video
        if self.infor.should_write_video:
            self._video_writer = WriteVideo(self.infor.overall_video["folder_path"], video_infor)
        else:
            self._video_writer = None

    def __clean_trash(self, tracker_id : int):
        if tracker_id in self._coordinates:
            del self._coordinates[tracker_id]
        if tracker_id in self._vehicle_speed:
            del self._vehicle_speed[tracker_id]
    
    def __get_cropped_image(self, frame, box):
        x1, y1, x2, y2 = box
        cropped_image = frame[y1:y2, x1:x2]
        return cropped_image

    def run(self, frame : np.ndarray):
        self._fps_monitor.tick()

        detections = self._get_detections(frame)

        # Chuyển đổi kết quả xử lí thành điểm ở ko gian thực
        points = detections.get_anchors_coordinates(Position.BOTTOM_CENTER)
        points = self._view_transformer.transform_points(points)

        # Lấy bounding box dùng để kiểm định sau
        bounding_boxes = detections.xyxy.astype(int)

        # Tiến hành xử lí tốc độ
        for tracker_id, box, point in zip(detections.tracker_id, bounding_boxes, points):
            # Thêm tracker_id vào quản lí
            trash = self._cache.put(tracker_id, None)
            if trash != -1:
                self.__clean_trash(trash)

            if tracker_id not in self._coordinates:
                self._coordinates[tracker_id] = {
                    "accumulate_frame" : 1,
                    "start" : point
                }        
            else:
                self._coordinates[tracker_id]["accumulate_frame"] += 1
                accumulate_frame = self._coordinates[tracker_id]["accumulate_frame"]
                
                # Phải vượt qua bao nhiêu frame đó thì mới tiến hành tính toán tốc
                # độ
                if accumulate_frame >= self.infor.max_frame:
                    st_x, st_y = self._coordinates[tracker_id]["start"]
                    en_x, en_y = point
                    
                    # Phần tính toán tốc độ
                    distance = math.sqrt((en_x - st_x) ** 2 + (en_y - st_y) ** 2)
                    time = accumulate_frame / self._fps_ratio
                    speed = int(distance / time * 3.6)

                    # Lưu trữ tốc độ theo tracker_id
                    if tracker_id not in self._vehicle_speed:
                        self._vehicle_speed[tracker_id] = {
                            "cumulative_speed" : [],
                            "speed" : 0,
                            "img" : self.__get_cropped_image(frame, box)
                        }
                    else:
                        self._vehicle_speed[tracker_id]["cumulative_speed"].append(speed)
                        speeds = self._vehicle_speed[tracker_id]["cumulative_speed"]
                        if len(speeds) >= self.infor.min_takes:
                            total = sum(speeds)
                            self._vehicle_speed[tracker_id]["speed"] = int(total / len(speeds))
                        
        if self.infor.should_write_video:
            # Xử lí labels
            labels = []
            for tracker_id in detections.tracker_id:
                if tracker_id in self._vehicle_speed and self._vehicle_speed[tracker_id]["speed"] != 0:
                    labels.append(f"Speed: {self._vehicle_speed[tracker_id]['speed']} km/h")
                else:
                    labels.append("Waiting")
            
            # Tiến hành lưu trữ video
            annotated_frame =  self.draw(frame, detections, labels)
            self._video_writer.write_frame(annotated_frame)
            return annotated_frame

        return None
    
    def _get_detections(self, frame : np.ndarray):
        frame = self._enhancer.enhance(frame)
        result = self.model(frame, verbose=False)[0]

        detections = Detections.from_ultralytics(result)
        detections = detections[detections.confidence >= self.infor.confidence_threshold]
        
        mask = np.isin(detections.class_id, self.infor.accp_classes)
        detections = detections[mask]

        detections = detections[self._polygon_zone.trigger(detections)]
        detections = detections.with_nms(**self.infor.nms_method)
        detections = self._byte_track.update_with_detections(detections)

        return detections
    
    def draw(self, frame : np.ndarray, detections : Detections, labels : List[str]):
        annotated_frame = frame.copy()

        annotated_frame = cv2.putText(annotated_frame, f"FPS:{self._fps_monitor.fps:.2f}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
        annotated_frame = self._bd_box_annotator.annotate(annotated_frame, detections)
        annotated_frame = self._label_annotator.annotate(annotated_frame, detections, labels)

        return annotated_frame
    