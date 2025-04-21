import os
import json

class GeneralInfor:
    CONFIG_FILE = "config/general.json"

    def __init__(self, acp_update : bool = False):
        if not os.path.exists(self.CONFIG_FILE):
            raise FileNotFoundError(f"Config file {self.CONFIG_FILE} not found")

        self._acp_update : bool = acp_update
        with open(self.CONFIG_FILE, "rb") as f:
            self._config = json.load(f)
    
    @property
    def address(self):
        return self._config['srv_address']
    
    @property
    def over_speed(self):
        return self._config['over_speed']

    def _write_file(self):
        with open(self.CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(self._config, f, indent=4)

    def update_address(self, address):
        if not self._acp_update:
            raise PermissionError("No permission to update config")
        self._config['srv_address'] = address
        self._write_file()
    
    def update_over_speed(self, overspeed : int):
        if not self._acp_update:
            raise PermissionError("No permission to update config")
        if not isinstance(overspeed, int):
            raise TypeError("Over speed must be an integer")
        self._config['over_speed'] = overspeed
        self._write_file()

if __name__ == "__main__":
    config = GeneralInfor()

    print("Thông tin cài đặt....")
    print("-----------------------------")
    print(f"Địa chỉ nhận dữ liệu: {config.address}")
    print(f"Giới hạn tốc độ: {config.over_speed}km/h")
    print("-----------------------------")