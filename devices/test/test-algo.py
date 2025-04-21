import argparse
import cv2
import numpy as np
import supervision as sv
from tqdm import tqdm
from ultralytics import YOLO
from core.image.EnhancerTool import EnhancerTool
from collections import defaultdict, deque

from ultralytics.solutions.speed_estimation import SpeedEstimator

SOURCE = np.array([
    [1252, 787],
    [2298, 803],
    [5039, 2159],
    [-550, 2159]
])

TARGET_WIDTH = 25
TARGET_HEIGHT = 250

TARGET = np.array([
    [0, 0],
    [TARGET_WIDTH - 1, 0],
    [TARGET_WIDTH - 1, TARGET_HEIGHT - 1],
    [0, TARGET_HEIGHT - 1],
])

TARGET_VIDEO_PATH = "vehicles-result.mp4"

class ViewTransformer:

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

def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Vehicle Speed Estimation using Inference and Supervision"
    )

    parser.add_argument(
        "--source_video_path",
        required=True,
        help="Path to the source video file",
        type=str
    )

    return parser.parse_args()

if __name__ == "__main__":
    args = parse_arguments()
    
    model = YOLO("model/yolov8n.pt")
    enhancer = EnhancerTool()

    video_info = sv.VideoInfo.from_video_path(args.source_video_path)
    # video_writer = cv2.VideoWriter("vehicles-result.mp4", cv2.VideoWriter_fourcc(*"mp4v"), video_info.fps, (video_info.width, video_info.height))

    thickness = sv.calculate_optimal_line_thickness(
        resolution_wh = video_info.resolution_wh
    )

    text_scale = sv.calculate_optimal_text_scale(
        resolution_wh = video_info.resolution_wh
    )

    byte_track = sv.ByteTrack(frame_rate=video_info.fps, lost_track_buffer=100)
    bounding_box_annotator = sv.BoxAnnotator(thickness=thickness)
    label_annotator = sv.LabelAnnotator(text_scale=text_scale, text_thickness=thickness)
    trace_annotator = sv.TraceAnnotator(
    thickness=thickness,
    trace_length=video_info.fps * 2,
    position=sv.Position.BOTTOM_CENTER
    )
    polygon_zone = sv.PolygonZone(SOURCE)
    view_transformer = ViewTransformer(source=SOURCE, target=TARGET)
    coordinates = defaultdict(lambda : deque(maxlen=video_info.fps))

    frame_generator = sv.get_video_frames_generator(args.source_video_path)

    with sv.VideoSink(TARGET_VIDEO_PATH, video_info) as sink:
        for frame in tqdm(frame_generator, desc="Processing frames", total=video_info.total_frames):
            frame = enhancer.enhance(frame)
            
            result = model(frame, verbose=False)[0]
            detections = sv.Detections.from_ultralytics(result)
            
            detections = detections[detections.confidence >= 0.3]
            detections = detections[detections.class_id != 0]

            detections = detections[polygon_zone.trigger(detections)]
            detections = detections.with_nms(0.5)

            detections = byte_track.update_with_detections(detections)

            points = detections.get_anchors_coordinates(sv.Position.BOTTOM_CENTER)
            points = view_transformer.transform_points(points).astype(int)

            for tracker_id, [_, y] in zip(detections.tracker_id, points):
                coordinates[tracker_id].append(y)
            
            labels = []
            for tracker_id in detections.tracker_id:
                if len(coordinates[tracker_id]) < video_info.fps // 2:
                    labels.append(f"#{tracker_id}")
                else:
                    coordinate_start = coordinates[tracker_id][0]
                    coordinate_end = coordinates[tracker_id][-1]
                    distance = abs(coordinate_end - coordinate_start)
                    time = len(coordinates[tracker_id]) / video_info.fps
                    speed = distance / time * 3.6
                    labels.append(f"#{tracker_id} {int(speed)} km/h")
            
            annotated_frame = frame.copy()
            annotated_frame = trace_annotator.annotate(annotated_frame, detections)
            annotated_frame = bounding_box_annotator.annotate(annotated_frame, detections)
            annotated_frame = label_annotator.annotate(annotated_frame, detections, labels)

            sink.write_frame(annotated_frame)