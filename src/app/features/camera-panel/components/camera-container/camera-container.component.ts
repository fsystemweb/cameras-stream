import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { CameraItem } from '../../../camera-list/models/camera-item';

@Component({
  selector: 'app-camera-container',
  standalone: true,
  templateUrl: './camera-container.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraContainerComponent {
  camera = input.required<CameraItem>();

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  fileDownload =
    viewChild.required<ElementRef<HTMLAnchorElement>>('fileDownload');

  snapshotUrls = '';

  takeSnapshot(): void {
    const videoElement = document.getElementById(
      this.camera().id,
    ) as HTMLVideoElement;
    const canvasElement = this.canvas().nativeElement;
    const context = canvasElement.getContext('2d');

    if (context && videoElement) {
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      context.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height,
      );

      this.snapshotUrls = canvasElement.toDataURL('image/jpeg');
      this.downloadFile();
    }
  }

  private downloadFile(): void {
    setTimeout(() => {
      this.fileDownload().nativeElement.click(); // wait render
    }, 200);
  }
}
