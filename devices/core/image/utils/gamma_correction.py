import cv2
import numpy as np

def apply_gamma(image : np.ndarray, gamma : float):
    """
    Apply gamma correction to an image.
    """
    if gamma == 0:
        raise ValueError("Gamma value cannot be 0")
    
    if gamma == 1.0:
        return image

    invGamma = 1 / gamma
    table = [((i / 255) ** invGamma) * 255 for i in range(256)]
    table = np.array(table, np.uint8)

    return cv2.LUT(image, table)