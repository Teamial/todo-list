import cv2
import sys
import numpy as np
import os
os.environ['OPENCV_VIDEOIO_DEBUG'] = '0'
os.environ['OPENCV_VIDEOIO_PRIORITY_MSMF'] = '0'

def check_camera_access():
    cam = cv2.VideoCapture(0)
    if not cam.isOpened():
        print("amera not found")

def initialize_camera():
    try: 
        cam = cv2.VideoCapture(0)
        if not cam.isOpened():
            raise Exception('Camera not found')
            
        frame_width = int(cam.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cam.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        return cam, frame_width, frame_height
    except Exception as e:
        print(f"Error initializing camera: {str(e)}")
        return None, None, None

def start_video_capture():
    cam, frame_width, frame_height = initialize_camera()
    if cam is None:
        return

        try:
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter('output.mp4', fourcc, 20.0, (frame_width, frame_height))

            while True:
                ret, frame = cam.read()
                if not ret:
                    print("Failed to capture frame")
                    break

                    # Here you can add your color analysis code
                    # Example: frame = your_color_analysis_function(frame)

                out.write(frame)
                cv2.imshow('Camera', frame)

                if cv2.waitKey(1) == ord('q'):
                    break
        except Exception as e:
            print(f"Error capturing video: {str(e)}")
        finally:
            cam.release()
            out.release()
            cv2.destroyAllWindows()

if __name__ == '__main__':
    start_video_capture()