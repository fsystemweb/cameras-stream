import { Component, effect, inject, input } from '@angular/core';
import { CameraItem } from '../../models/camera-item';
import { ActiveCamerasService } from '../../../../shared/services/active-cameras.service';
import { NavigatorHelperService } from '../../../../shared/services/navigator-helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-item',
  standalone: true,
  templateUrl: './list-item.component.html',
})
export class ListItemComponent {
  private activeCamerasService = inject(ActiveCamerasService);
  private navigatorHelperService = inject(NavigatorHelperService);
  private toastr = inject(ToastrService);

  cameraItem = input.required<CameraItem>();

  webcamPermission: boolean | undefined = undefined;

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
      return;
    }

    if (this.webcamPermission === undefined) {
      this.displayPermissionMessage();
      this.checkCameraPermission();
    }
  }
}
