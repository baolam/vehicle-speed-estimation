import signal
import time
from core.constant import NAMESPACE
from core.socket import sio
from core.socket import socket_thread
from core.socket import exit_event
from core.socket import exit_program

if __name__ == "__main__":
    signal.signal(signal.SIGINT, exit_program)
    signal.signal(signal.SIGTERM, exit_program)

    socket_thread.start()
    time.sleep(10)

    try:
        while not exit_event.is_set():
            # Lường hoạt động của camera
            pass
    except KeyboardInterrupt:
        exit_program()