import { Component, DestroyRef, inject } from '@angular/core';
import { WebcamComponent } from '../webcam/webcam.component';
import { CameraItem } from '../../../camera-list/models/camera-item';
import { CameraStreamComponent } from '../camera-stream/camera-stream.component';
import { ActiveCamerasService } from '../../../../shared/services/active-cameras.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera-panel',
  standalone: true,
  templateUrl: './camera-panel.component.html',
  imports: [CommonModule, WebcamComponent, CameraStreamComponent],
})
export class CameraPanelComponent {
  private activeCamerasService = inject(ActiveCamerasService);
  private destroyRef = inject(DestroyRef);

  camerasActive: CameraItem[] = [];

  constructor() {
    this.activeCamerasService
      .getCameras$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cameras) => {
        this.camerasActive = cameras;
      });
  }

  getGridClass(): string {
    const length = this.camerasActive.length;
    if (length === 1) {
      return 'grid grid-cols-1';
    } else if (length === 2) {
      return 'grid grid-cols-2';
    } else if (length <= 4) {
      return 'grid grid-cols-2 gap-2';
    } else {
      return 'grid grid-cols-4 gap-2';
    }
  }
}
