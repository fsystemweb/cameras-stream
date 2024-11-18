import { Injectable, WritableSignal } from '@angular/core';

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

  onLoading(video: HTMLVideoElement, loading: WritableSignal<boolean>): void {
    video.onloadedmetadata = (): void => {
      loading.set(false);
    };
  }
}
