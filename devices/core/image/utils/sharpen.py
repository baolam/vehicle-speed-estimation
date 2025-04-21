import cv2
import numpy as np

kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
 
def sharpen_image(image : np.ndarray):
    sharpened_image = cv2.filter2D(image, -1, kernel)
    return sharpened_image