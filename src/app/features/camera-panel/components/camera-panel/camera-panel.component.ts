import { Component } from '@angular/core';
import { WebcamComponent } from '../webcam/webcam.component';
import { CameraItem } from '../../../camera-list/models/camera-item';
import { CameraStreamComponent } from '../camera-stream/camera-stream.component';

@Component({
  selector: 'app-camera-panel',
  standalone: true,
  templateUrl: './camera-panel.component.html',
  imports: [WebcamComponent, CameraStreamComponent],
})
export class CameraPanelComponent {
  camerasActive: CameraItem[] = [];
}
