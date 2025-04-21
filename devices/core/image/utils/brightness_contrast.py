import cv2
import numpy as np

def brightness_contrast(image : np.ndarray, brightness : float, contrast : float):
    """
    Applies brightness and contrast adjustments to an image.
    """
    # Ensure the image is a numpy array
    # image = np.asarray(image)
    result = cv2.convertScaleAbs(image, alpha=contrast, beta=brightness)
    return result