import { Component } from '@angular/core';
import { LayoutComponent } from './core/components/layout/layout.component';
import { CameraListComponent } from './features/camera-list/components/camera-list/camera-list.component';
import { CameraPanelComponent } from './features/camera-panel/components/camera-panel/camera-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent, CameraListComponent, CameraPanelComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'StreamCam Manager';
}
