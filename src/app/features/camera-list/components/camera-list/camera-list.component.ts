import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { CameraItem } from '../../../../shared/models/camera-item';
import { ListItemComponent } from '../list-item/list-item.component';
import { ActiveCamerasService } from '../../../../shared/services/active-cameras.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-camera-list',
  standalone: true,
  templateUrl: './camera-list.component.html',
  imports: [ListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraListComponent {
  private activeCamerasService = inject(ActiveCamerasService);
  private destroyRef = inject(DestroyRef);
  private ref = inject(ChangeDetectorRef);

  cameras: CameraItem[] = [];

  constructor() {
    this.updateCameras();
  }

  private updateCameras(): void {
    this.activeCamerasService
      .getCameras$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((camerasUpdates) => {
        this.cameras = camerasUpdates;
        this.ref.markForCheck();
      });
  }
}
