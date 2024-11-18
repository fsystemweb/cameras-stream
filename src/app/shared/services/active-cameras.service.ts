import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CameraItem } from '../../features/camera-list/models/camera-item';

@Injectable({
  providedIn: 'root',
})
export class ActiveCamerasService {
  private dataSubject: BehaviorSubject<CameraItem[]> = new BehaviorSubject<
    CameraItem[]
  >([]);

  addCamera(cameraItem: CameraItem): void {
    const currentData = this.dataSubject.value;
    const updatedData = [...currentData, cameraItem];
    this.dataSubject.next(updatedData);
  }

  removeCamera(cameraItem: CameraItem): void {
    const currentData = this.dataSubject.value;
    const updatedData = currentData.filter((item) => item.id !== cameraItem.id);
    this.dataSubject.next(updatedData);
  }

  getCameras$(): Observable<CameraItem[]> {
    return this.dataSubject.asObservable();
  }

  updateCamera(updatedCamera: CameraItem): void {
    const currentData = this.dataSubject.value;

    const updatedData = currentData.map((item) =>
      item.id === updatedCamera.id ? { ...item, ...updatedCamera } : item,
    );
    this.dataSubject.next(updatedData);
  }
}
