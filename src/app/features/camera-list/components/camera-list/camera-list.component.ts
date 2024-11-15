import { Component } from '@angular/core';
import { CameraItem } from '../../models/camera-item';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'app-camera-list',
  standalone: true,
  templateUrl: './camera-list.component.html',
  imports: [ListItemComponent],
})
export class CameraListComponent {
  cameras: CameraItem[] = [
    {
      title: 'My webcam',
      selected: false,
    },
    {
      title: 'Madrid',
      selected: false,
    },
    {
      title: 'New York',
      selected: false,
    },
  ];
}
