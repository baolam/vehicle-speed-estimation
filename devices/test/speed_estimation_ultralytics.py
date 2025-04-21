import cv2

from ultralytics import solutions

cap = cv2.VideoCapture("E:/vehicle-speed-estimation/devices/resources/vehicles.mp4")
assert cap.isOpened(), "Error reading video file"
# cap = cv2.VideoCapture()

# Video writer
w, h, fps = (int(cap.get(x)) for x in (cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT, cv2.CAP_PROP_FPS))
video_writer = cv2.VideoWriter("speed_management.avi", cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h))

# speed region points
speed_region = [
    [1252, 787],
    [2298, 803],
    [5039, 2159],
    [-550, 2159]
]

# Initialize speed estimation object
speedestimator = solutions.SpeedEstimator(
    show=True,  # display the output
    model="model/yolov8s.pt",  # path to the YOLO11 model file.
    region=speed_region,  # pass region points
    # classes=[0, 2],  # estimate speed of specific classes.
    # line_width=2,  # adjust the line width for bounding boxes
)

# Process video
while cap.isOpened():
    success, im0 = cap.read()

    if not success:
        print("Video frame is empty or processing is complete.")
        break

    results = speedestimator.estimate_speed(im0)
    # print(speedestimator.spd)

    # print(results)  # access the output

    video_writer.write(results)  # write the processed frame.

cap.release()
video_writer.release()
cv2.destroyAllWindows()  # destroy all opened windows