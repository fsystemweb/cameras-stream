import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { CameraListComponent } from './features/camera-list/components/camera-list/camera-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent, CameraListComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'StreamCam Manager';
}
