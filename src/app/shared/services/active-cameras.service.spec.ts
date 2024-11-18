import { TestBed } from '@angular/core/testing';
import { ActiveCamerasService } from './active-cameras.service';
import { CameraItem } from '../models/camera-item';

describe('ActiveCamerasService', () => {
  let service: ActiveCamerasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveCamerasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a camera and update the data', () => {
    const newCamera: CameraItem = {
      id: 'cam9',
      title: 'Test Camera',
      streamUrl: '',
      localWebcam: false,
      selected: true,
    };

    service.addCamera(newCamera);

    service.getCameras$().subscribe((cameras) => {
      const addedCamera = cameras.find((camera) => camera.id === 'cam9');
      expect(addedCamera).toBeTruthy();
      expect(addedCamera?.title).toBe('Test Camera');
      expect(addedCamera?.selected).toBe(true);
    });
  });

  it('should remove a camera and update the data', () => {
    const cameraToRemove: CameraItem = {
      id: 'cam1',
      title: 'My Webcam',
      streamUrl: '',
      localWebcam: true,
      selected: false,
    };

    service.removeCamera(cameraToRemove);

    service.getCameras$().subscribe((cameras) => {
      const removedCamera = cameras.find((camera) => camera.id === 'cam1');
      expect(removedCamera).toBeTruthy();
      expect(removedCamera?.selected).toBe(false);
    });
  });

  it('should update camera data correctly', () => {
    const updatedCamera: CameraItem = {
      id: 'cam1',
      title: 'Updated Webcam',
      streamUrl: '',
      localWebcam: true,
      selected: true,
    };

    service.updateCamera(updatedCamera);

    service.getCameras$().subscribe((cameras) => {
      const camera = cameras.find((camera) => camera.id === 'cam1');
      expect(camera).toBeTruthy();
      expect(camera?.title).toBe('Updated Webcam');
      expect(camera?.selected).toBe(true);
    });
  });

  it('should handle multiple updates correctly', () => {
    const updatedCamera1: CameraItem = {
      id: 'cam1',
      title: 'Updated Webcam 1',
      streamUrl: '',
      localWebcam: true,
      selected: true,
    };

    const updatedCamera2: CameraItem = {
      id: 'cam2',
      title: 'Updated RTVE 24H',
      streamUrl: 'new-stream-url',
      localWebcam: false,
      selected: true,
    };

    service.updateCamera(updatedCamera1);
    service.updateCamera(updatedCamera2);

    service.getCameras$().subscribe((cameras) => {
      const camera1 = cameras.find((camera) => camera.id === 'cam1');
      const camera2 = cameras.find((camera) => camera.id === 'cam2');

      expect(camera1).toBeTruthy();
      expect(camera1?.title).toBe('Updated Webcam 1');
      expect(camera1?.selected).toBe(true);

      expect(camera2).toBeTruthy();
      expect(camera2?.title).toBe('Updated RTVE 24H');
      expect(camera2?.streamUrl).toBe('new-stream-url');
      expect(camera2?.selected).toBe(true);
    });
  });
});
