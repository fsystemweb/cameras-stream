import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { CameraItem } from '../../../../shared/models/camera-item';
import { ActiveCamerasService } from '../../../../shared/services/active-cameras.service';
import { NavigatorHelperService } from '../../../../shared/services/navigator-helper.service';
import { ToastrService } from 'ngx-toastr';
import { EditCameraComponent } from '../../../edit-camera/components/edit-camera/edit-camera.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  StreamHealthService,
  StreamHealthStatus,
} from '../../../../shared/services/stream-health.service';

@Component({
  selector: 'app-list-item',
  standalone: true,
  templateUrl: './list-item.component.html',
  imports: [EditCameraComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent {
  private activeCamerasService = inject(ActiveCamerasService);
  private navigatorHelperService = inject(NavigatorHelperService);
  private ref = inject(ChangeDetectorRef);
  private toastr = inject(ToastrService);
  private readonly streamHealthService = inject(StreamHealthService);

  cameraItem = input.required<CameraItem>();

  healthStatus: StreamHealthStatus = 'unknown';

  webcamPermission: boolean | undefined = undefined;

  displayEditCamera = false;

  constructor() {
    effect(() => {
      this.initializeEffect();
    });

    this.streamHealthService.statuses$
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((statuses) => {
        const nextStatus = statuses[this.cameraItem().id] ?? 'unknown';
        if (this.healthStatus !== nextStatus) {
          this.healthStatus = nextStatus;
          this.ref.markForCheck();
        }
      });
  }

  /** Tailwind color for the health dot, depending on the probe result. */
  healthDotClass(): string {
    if (this.healthStatus === 'live') {
      return 'bg-green-500 ring-green-100';
    }
    if (this.healthStatus === 'offline') {
      return 'bg-red-500 ring-red-100';
    }
    return 'bg-slate-300 ring-slate-100';
  }

  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.activeCamerasService.addCamera(this.cameraItem());
    } else {
      this.activeCamerasService.removeCamera(this.cameraItem());
    }
  }

  openDialog(): void {
    if (this.cameraItem().selected) {
      this.toastr.warning('Stop this stream execution before edit.');
    } else {
      this.displayEditCamera = true;
    }
  }

  private checkCameraPermission(): void {
    const mediaDevices = this.navigatorHelperService.getMediaService();
    mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        this.webcamPermission = true;
      })
      .catch(() => {
        this.webcamPermission = false;
      })
      .finally(() => {
        this.navigatorHelperService.setCameraPermissionForNextSession(
          this.webcamPermission ?? false,
        );
        this.ref.markForCheck();
      });
  }

  private displayPermissionMessage(): void {
    this.toastr.info('Grant permission to access your camera.');
  }

  private initializeEffect(): void {
    const camera = this.cameraItem();
    if (!camera || !camera.localWebcam) {
      return;
    }

    const isPermissionStoredTrue =
      this.navigatorHelperService.getCameraPermissionStored();

    if (isPermissionStoredTrue) {
      this.webcamPermission = isPermissionStoredTrue;
      this.ref.markForCheck();
      return;
    }

    if (this.webcamPermission === undefined) {
      this.displayPermissionMessage();
      this.checkCameraPermission();
    }
  }
}
