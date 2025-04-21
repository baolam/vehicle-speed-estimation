import signal
from core.socket import socket_thread
from core.socket import exit_event
from core.socket import exit_program

if __name__ == "__main__":
    signal.signal(signal.SIGINT, exit_program)
    signal.signal(signal.SIGTERM, exit_program)

    socket_thread.start()
    try:
        while not exit_event.is_set():
            pass
    except KeyboardInterrupt:
        exit_program()