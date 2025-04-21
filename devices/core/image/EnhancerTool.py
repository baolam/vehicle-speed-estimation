import json
import os
import numpy as np
from .utils.brightness_contrast import brightness_contrast
from .utils.gamma_correction import apply_gamma
from .utils.sharpen import sharpen_image

class EnhancerTool:
    CONFIG_FILE = "config/enhancer.json"

    def __init__(self):
        self._record_changed()

    @property
    def should_enhance(self):
        return not self._config["skip_enhancement"]

    @property
    def should_use_gamma(self):
        return not self._config["gamma_infor"]["skip"]

    @property
    def should_use_brightness_contrast(self):
        return not self._config["adjust_general"]["skip"]

    @property
    def should_sharpen(self):
        return not self._config["sharpen"]["skip"]

    def __check_conflict_config(self):
        if self.should_enhance:
            infor = any([self.should_use_gamma, self.should_use_brightness_contrast, self.should_sharpen])
            if not infor:
                raise ValueError("No enhancement method selected")
 
    def update_sharpen_status(self, status : bool):
        self._config["sharpen"]["skip"] = status

    def update_brightness_contrast_status(self, status : bool):
        self._config["adjust_general"]["skip"] = status
    
    def update_gamma_status(self, status : bool):
        self._config["gamma_infor"]["skip"] = status

    def update_brightness_contrast(self, brightness, contrast):
        self._config["adjust_general"]["brightness"] = brightness
        self._config["adjust_general"]["contrast"] = contrast
    
    def update_gamma(self, gamma : float):
        self._config["gamma_infor"]["gamma"] = gamma

    def enhance(self, image : np.ndarray):
        if not self.should_enhance:
            return image
        # Thứ tự thao tác, adjust, gamma, sharpen
        if self.should_use_brightness_contrast: image = brightness_contrast(image, self._config["adjust_general"]["brightness"], self._config["adjust_general"]["contrast"])
        if self.should_use_gamma: image = apply_gamma(image, self._config["gamma_infor"]["gamma"])
        if self.should_sharpen: image = sharpen_image(image)
        return image
    
    def _record_changed(self):
        if not os.path.exists(self.CONFIG_FILE):
            raise FileNotFoundError(f"Config file {self.CONFIG_FILE} not found")
        
        with open(self.CONFIG_FILE, "rb") as f:
            self._config = json.load(f)
        self.__check_conflict_config()

if __name__ == "__main__":
    enhancer_tool = EnhancerTool()

    print("Thông tin công cụ tăng cường ảnh")

    print("--------------------------------------------------------")
    print(f"Chọn tăng cường ảnh: {enhancer_tool.should_enhance}")
    print(f"Chọn tăng độ nét: {enhancer_tool.should_sharpen}")
    print(f"Chọn tăng độ sáng và độ tương phản: {enhancer_tool.should_use_brightness_contrast}")
    print(f"Chọn tăng độ gamma: {enhancer_tool.should_use_gamma}")
    print(f"Độ sáng: {enhancer_tool._config['adjust_general']['brightness']}")
    print(f"Độ tương phản: {enhancer_tool._config['adjust_general']['contrast']}")
    print(f"Độ gamma: {enhancer_tool._config['gamma_infor']['gamma']}")
    print("--------------------------------------------------------")