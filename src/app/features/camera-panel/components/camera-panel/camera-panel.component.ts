import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { WebcamComponent } from '../webcam/webcam.component';
import { CameraItem } from '../../../../shared/models/camera-item';
import { CameraStreamComponent } from '../camera-stream/camera-stream.component';
import { ActiveCamerasService } from '../../../../shared/services/active-cameras.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { CameraContainerComponent } from '../camera-container/camera-container.component';

@Component({
  selector: 'app-camera-panel',
  standalone: true,
  templateUrl: './camera-panel.component.html',
  imports: [
    CommonModule,
    WebcamComponent,
    CameraStreamComponent,
    CameraContainerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraPanelComponent {
  private activeCamerasService = inject(ActiveCamerasService);
  private destroyRef = inject(DestroyRef);
  private ref = inject(ChangeDetectorRef);

  camerasActive: CameraItem[] = [];

  constructor() {
    this.activeCamerasService
      .getCameras$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cameras) => {
        this.camerasActive = cameras.filter((item) => item.selected);
        this.ref.markForCheck();
      });
  }

  getGridClass(): string {
    const length = this.camerasActive.length;
    if (length === 0) {
      return 'hidden';
    } else if (length === 1) {
      return 'grid grid-cols-1';
    } else if (length === 2) {
      return 'grid grid-cols-2';
    } else if (length <= 6) {
      return 'grid grid-cols-3';
    } else {
      return 'grid grid-cols-4';
    }
  }
}
