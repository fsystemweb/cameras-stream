import { Injectable } from '@angular/core';

const CAMERA_PERMISSION_KEY = 'webCamera';

@Injectable({
  providedIn: 'root',
})
export class NavigatorHelperService {
  setCameraPermissionForNextSession(value: boolean): void {
    localStorage.setItem(CAMERA_PERMISSION_KEY, value.toString());
  }

  getCameraPermissionStored(): boolean {
    const value = localStorage.getItem(CAMERA_PERMISSION_KEY);
    return value === 'true';
  }

  getMediaService(): MediaDevices {
    return navigator.mediaDevices;
  }
}
