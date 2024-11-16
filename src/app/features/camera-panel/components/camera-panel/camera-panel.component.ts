import { Component } from '@angular/core';
import { WebcamComponent } from '../webcam/webcam.component';
import { CameraItem } from '../../../camera-list/models/camera-item';

@Component({
  selector: 'app-camera-panel',
  standalone: true,
  templateUrl: './camera-panel.component.html',
  imports: [WebcamComponent],
})
export class CameraPanelComponent {
  camerasActive: CameraItem[] = [];
}
