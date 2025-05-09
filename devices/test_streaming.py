# import sys
# sys.path.append("../")

import signal
import time
import base64
import cv2

from core.constant import NAMESPACE
from core.socket import sio
from core.socket import socket_thread
from core.socket import exit_event
from core.socket import exit_program

src_vid = cv2.VideoCapture("test/speed_management.mp4")

if __name__ == "__main__":
    signal.signal(signal.SIGINT, exit_program)
    signal.signal(signal.SIGTERM, exit_program)

    socket_thread.start()
    print("Đợi kết nối đến server!")
    while not sio.connected:
        time.sleep(0.2)
    print("Kết nối thành công.")

    try:
        while not exit_event.is_set() and src_vid.isOpened():
            ret, frame = src_vid.read()
            frame = cv2.resize(frame, (640, 480))
            success, buffer = cv2.imencode('.jpg', frame)
            if not success:
                continue

            # Chuyển thành chuỗi base64
            frame_b64 = base64.b64encode(buffer).decode('utf-8')
            base64_string = f"data:image/jpeg;base64,{frame_b64}"
            sio.emit("streaming", base64_string, namespace=NAMESPACE)
        print("Hoàn thành")

    except Exception as e:
        exit_program()