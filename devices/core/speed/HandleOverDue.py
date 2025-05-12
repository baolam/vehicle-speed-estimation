import cv2
import base64

from datetime import datetime
from collections import defaultdict
from ..constant import NAMESPACE
from ..socket import sio
from ..GeneralInfor import GeneralInfor


class HandleOverDue:
    def __init__(self):
        self._infor = GeneralInfor()
        self._mem = defaultdict(bool)
    
    def handle(self, speeds, show_console : bool = True):

        for id, speed_obj in speeds.items():
            if id not in self._mem:
                if speed_obj["speed"] == 0:
                    continue

                self._mem[id] = speed_obj["speed"]
        
                # Tiến hành ghi nhận quá tốc độ
                if self._mem[id] >= self._infor.over_speed:
                    if show_console:
                        print(f"ID: {id}, quá tốc độ. Tốc độ hiện tại: {self._mem[id]}")
                    self.__send_package_to_server(speed_obj)

    def __send_package_to_server(self, speed_obj):
        img = speed_obj["img"]
        speed = speed_obj["speed"]
        licensePlate = "49AA 004.69" # Chưa đc đăng ký
        time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        try:
            state, buffer = cv2.imencode(".jpg", img)
        
            frame_b64 = base64.b64encode(buffer).decode('utf-8')
            embed_img = f"data:image/jpeg;base64,{frame_b64}"
        except:
            embed_img = ""
        
        data_obj = {
            "licensePlate" : licensePlate,
            "time" : time,
            "speed" : speed,
            "embed_img" : embed_img
        }

        sio.emit("overspeed", data=data_obj, namespace=NAMESPACE)