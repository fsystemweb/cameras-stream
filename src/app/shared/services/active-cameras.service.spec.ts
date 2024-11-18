import { TestBed } from '@angular/core/testing';
import { ActiveCamerasService } from './active-cameras.service';
import { CameraItem } from '../../features/camera-list/models/camera-item';

describe('ActiveCamerasService', () => {
  let service: ActiveCamerasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveCamerasService);
  });

  it('should add a camera', () => {
    const camera: CameraItem = {
      id: 'cam3',
      title: 'Camera 1',
      localWebcam: false,
    };
    service.addCamera(camera);

    service.getCameras$().subscribe((cameras) => {
      expect(cameras).toContain(camera);
    });
  });

  it('should remove a camera', () => {
    const camera1: CameraItem = {
      id: 'cam1',
      title: 'Camera 1',
      localWebcam: true,
    };
    const camera2: CameraItem = {
      id: 'cam2',
      title: 'Camera 2',
      localWebcam: false,
    };

    service.addCamera(camera1);
    service.addCamera(camera2);

    service.removeCamera(camera1);

    service.getCameras$().subscribe((cameras) => {
      expect(cameras).not.toContain(camera1);
      expect(cameras).toContain(camera2);
    });
  });

  it('should return an observable of cameras', () => {
    const camera: CameraItem = {
      id: 'cam1',
      title: 'Camera 1',
      localWebcam: false,
    };
    service.addCamera(camera);

    service.getCameras$().subscribe((cameras) => {
      expect(Array.isArray(cameras)).toBe(true);
      expect(cameras.length).toBe(1);
      expect(cameras[0]).toEqual(camera);
    });
  });

  it('should update a camera', () => {
    const cameraToAdd: CameraItem = {
      id: '1',
      title: 'Camera 1',
      localWebcam: false,
    };
    const cameraToUpdate: CameraItem = {
      id: '1',
      title: 'Updated Camera',
      localWebcam: false,
    };

    service.addCamera(cameraToAdd);
    service.updateCamera(cameraToUpdate);

    service.getCameras$().subscribe((cameras) => {
      expect(cameras.length).toBe(1);
      expect(cameras[0]).toEqual(cameraToUpdate);
    });
  });
});
