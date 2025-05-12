import signal
import time

from core.socket import socket_thread
from core.socket import exit_program
from core.Camera import Camera
from core.speed.SpeedEstimator import SpeedEstimator
from core.speed.HandleOverDue import HandleOverDue

if __name__ == "__main__":
    signal.signal(signal.SIGINT, exit_program)
    signal.signal(signal.SIGTERM, exit_program)

    socket_thread.start()

    camera = Camera("E:/vehicle-speed-estimation/devices/resources/vehicles.mp4")
    speed_estimator = SpeedEstimator(camera._info)
    handler = HandleOverDue()

    time.sleep(10)
    print("Vehicle speed estimator is running...")

    try:
        # Triển khai chạy Stream thuật toán
        for frame in camera.get_frame():
            speed_estimator.run(frame)
            handler.handle(speed_estimator._vehicle_speed)
        
        print("Finished")
        exit_program()

    except KeyboardInterrupt:
        exit_program()