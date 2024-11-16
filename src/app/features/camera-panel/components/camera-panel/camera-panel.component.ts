import { Component, DestroyRef, inject } from '@angular/core';
import { WebcamComponent } from '../webcam/webcam.component';
import { CameraItem } from '../../../camera-list/models/camera-item';
import { CameraStreamComponent } from '../camera-stream/camera-stream.component';
import { ActiveCamerasService } from '../../../../shared/services/active-cameras.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-camera-panel',
  standalone: true,
  templateUrl: './camera-panel.component.html',
  imports: [WebcamComponent, CameraStreamComponent],
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
}
