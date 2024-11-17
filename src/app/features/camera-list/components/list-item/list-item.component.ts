import { Component, inject, input } from '@angular/core';
import { CameraItem } from '../../models/camera-item';
import { ActiveCamerasService } from '../../../../shared/services/active-cameras.service';

@Component({
  selector: 'app-list-item',
  standalone: true,
  templateUrl: './list-item.component.html',
})
export class ListItemComponent {
  private activeCamerasService = inject(ActiveCamerasService);
  cameraItem = input.required<CameraItem>();

  webcamPermission = false;

  constructor() {
    this.checkCameraPermission();
  }

  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.activeCamerasService.addCamera(this.cameraItem());
    } else {
      this.activeCamerasService.removeCamera(this.cameraItem());
    }
  }

  private checkCameraPermission(): void {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        this.webcamPermission = true;
      })
      .catch(() => {
        this.webcamPermission = false;
      });
  }
}
