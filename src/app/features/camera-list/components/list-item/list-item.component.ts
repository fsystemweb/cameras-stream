import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { CameraItem } from '../../../../shared/models/camera-item';
import { ActiveCamerasService } from '../../../../shared/services/active-cameras.service';
import { NavigatorHelperService } from '../../../../shared/services/navigator-helper.service';
import { ToastrService } from 'ngx-toastr';
import { EditCameraComponent } from '../../../edit-camera/components/edit-camera/edit-camera.component';

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

  cameraItem = input.required<CameraItem>();

  webcamPermission: boolean | undefined = undefined;

  displayEditCamera = false;

  constructor() {
    effect(() => {
      this.initializeEffect();
    });
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
