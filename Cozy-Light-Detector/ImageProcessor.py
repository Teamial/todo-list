import cv2
import sys
import numpy as np
import time
import os
os.environ['OPENCV_VIDEOIO_DEBUG'] = '0'
os.environ['OPENCV_VIDEOIO_PRIORITY_MSMF'] = '0'

import cv2
import sys
import time

def test_camera_devices():
    # Try different camera indices
    for i in range(2):
        print(f"Testing camera index {i}")
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            ret, frame = cap.read()
            if ret:
                print(f"Successfully accessed camera {i}")
                cap.release()
                return i
            else:
                print(f"Could open camera {i} but couldn't read frame")
        else:
            print(f"Could not open camera {i}")
        cap.release()
    return -1

def start_video_capture():
    # Find working camera
    camera_index = test_camera_devices()
    if camera_index == -1:
        print("No working camera found")
        return

    print(f"Using camera {camera_index}")
    cam = cv2.VideoCapture(camera_index)
    
    if not cam.isOpened():
        print("Error: Camera failed to initialize")
        return

    try:
        # Add short delay to allow camera to initialize
        time.sleep(1)
        
        frame_width = int(cam.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cam.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        print(f"Camera resolution: {frame_width}x{frame_height}")

        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter('output.mp4', fourcc, 20.0, (frame_width, frame_height))

        while True:
            ret, frame = cam.read()
            if not ret:
                print("Failed to grab frame")
                break

            out.write(frame)
            cv2.imshow('Camera', frame)

            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                print("Quit command received")
                break

    except Exception as e:
        print(f"Error during capture: {str(e)}")
    finally:
        print("Cleaning up resources")
        cam.release()
        out.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    print("Starting camera test...")
    start_video_capture()