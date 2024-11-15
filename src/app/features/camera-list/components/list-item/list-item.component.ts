import { Component, input } from '@angular/core';
import { CameraItem } from '../../models/camera-item';

@Component({
  selector: 'app-list-item',
  standalone: true,
  templateUrl: './list-item.component.html',
})
export class ListItemComponent {
  cameraItem = input.required<CameraItem>();
}
