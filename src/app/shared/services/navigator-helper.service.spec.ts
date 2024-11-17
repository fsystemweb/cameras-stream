import { TestBed } from '@angular/core/testing';
import { NavigatorHelperService } from './navigator-helper.service';

describe('NavigatorHelperService', () => {
  let service: NavigatorHelperService;
  const CAMERA_PERMISSION_KEY = 'webCamera';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavigatorHelperService],
    });
    service = TestBed.inject(NavigatorHelperService);
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setCameraPermissionForNextSession', () => {
    it('should store the camera permission in localStorage', () => {
      service.setCameraPermissionForNextSession(true);
      expect(localStorage.getItem(CAMERA_PERMISSION_KEY)).toBe('true');

      service.setCameraPermissionForNextSession(false);
      expect(localStorage.getItem(CAMERA_PERMISSION_KEY)).toBe('false');
    });
  });

  describe('getCameraPermissionStored', () => {
    it('should return true if permission is stored as "true"', () => {
      localStorage.setItem(CAMERA_PERMISSION_KEY, 'true');
      expect(service.getCameraPermissionStored()).toBe(true);
    });

    it('should return false if permission is stored as "false"', () => {
      localStorage.setItem(CAMERA_PERMISSION_KEY, 'false');
      expect(service.getCameraPermissionStored()).toBe(false);
    });

    it('should return false if no permission is stored', () => {
      expect(service.getCameraPermissionStored()).toBe(false);
    });
  });

  describe('getMediaService', () => {
    it('should return the navigator.mediaDevices object', () => {
      expect(service.getMediaService()).toBe(navigator.mediaDevices);
    });
  });
});
