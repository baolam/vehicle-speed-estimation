import json
import requests
import socketio
import threading
import sys

from .speed_estimator import speed_estimator
from .constant import AUTHENTICATION_INFOR, LOGIN, TARGET, NAMESPACE
with open(AUTHENTICATION_INFOR, "rb") as f:
    authentication_infor = json.load(f)

sio = socketio.Client()
exit_event = threading.Event()

def connect_to_server():
    try:
        token = requests.post(LOGIN, json=authentication_infor).json()["token"]
        sio.connect(TARGET, namespaces=[NAMESPACE] ,auth={"Authorization": f"Bearer {token}"})
        sio.wait()
    except Exception as e:
        print("Unexpected error occurred while connecting to the server.")
        print(e)

socket_thread = threading.Thread(name="Socket client", target=connect_to_server)
def exit_program(signal_received=None, frame=None):
    print("Stop program")
    exit_event.set()
    sio.disconnect()
    sys.exit(0)

### Một số handler tương ứng
def socket_connected():
    print("Connected to server successfully!")

def socket_disconnected():
    print("Stopped by server!")
    exit_program()

def request_enhancer_infor(infor):
    data = speed_estimator._enhancer._config
    sio.emit("response-user", data={
        "result" : data,
        "socketId" : infor["socketId"],
        "event" : "request-enhancer-infor"
    }, namespace=NAMESPACE)

def request_speed_estimator_infor(infor):
    data = speed_estimator.infor._config
    sio.emit("response-user", data={
        "result" : data,
        "socketId" : infor["socketId"],
        "event" : "request-speed-estimator-infor"
    }, namespace=NAMESPACE)

### Tiến hành cài đặt lắng nghe các sự kiện
sio.on("connect", handler=socket_connected, namespace=NAMESPACE)
sio.on("disconnect", handler=socket_disconnected, namespace=NAMESPACE)
sio.on("request-enhancer-infor", handler=request_enhancer_infor, namespace=NAMESPACE)
sio.on("request-speed-estimator-infor", handler=request_speed_estimator_infor, namespace=NAMESPACE)
### ---------------------------------------