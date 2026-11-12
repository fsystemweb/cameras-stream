import { Component, inject } from '@angular/core';
import { LayoutComponent } from './core/components/layout/layout.component';
import { CameraListComponent } from './features/camera-list/components/camera-list/camera-list.component';
import { CameraPanelComponent } from './features/camera-panel/components/camera-panel/camera-panel.component';
import { StreamHealthService } from './shared/services/stream-health.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent, CameraListComponent, CameraPanelComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly streamHealthService = inject(StreamHealthService);

  title = 'StreamCam Manager';

  constructor() {
    // Starts the periodic live/offline probing of every stream camera.
    this.streamHealthService.start();
  }
}
