import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CameraItem } from '../../../../shared/models/camera-item';
import {
  StreamHealthService,
  StreamHealthStatus,
} from '../../../../shared/services/stream-health.service';

@Component({
  selector: 'app-camera-container',
  standalone: true,
  templateUrl: './camera-container.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraContainerComponent {
  private readonly streamHealthService = inject(StreamHealthService);
  private readonly cdkRef = inject(ChangeDetectorRef);

  healthStatus: StreamHealthStatus = 'unknown';

  pictureInPictureSupported: boolean =
    typeof document !== 'undefined' &&
    document.pictureInPictureEnabled === true;

  camera = input.required<CameraItem>();

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  fileDownload =
    viewChild.required<ElementRef<HTMLAnchorElement>>('fileDownload');

  snapshotUrls = '';

  constructor(destroyRef: DestroyRef) {
    this.streamHealthService.statuses$
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((statuses) => {
        const nextStatus = statuses[this.camera().id] ?? 'unknown';
        if (this.healthStatus !== nextStatus) {
          this.healthStatus = nextStatus;
          this.cdkRef.markForCheck();
        }
      });
  }

  /** Returns the health label shown on the status chip. */
  healthLabel(): string {
    if (this.camera().localWebcam) {
      return 'Local camera';
    }
    if (this.healthStatus === 'live') {
      return 'Live';
    }
    if (this.healthStatus === 'offline') {
      return 'Offline';
    }
    return 'Checking…';
  }

  healthDotClass(): string {
    if (this.camera().localWebcam) {
      return 'bg-sky-400';
    }
    if (this.healthStatus === 'live') {
      return 'bg-green-400';
    }
    if (this.healthStatus === 'offline') {
      return 'bg-red-500';
    }
    return 'bg-slate-400';
  }

  /** Floats the camera video into native picture-in-picture mode. */
  async togglePictureInPicture(): Promise<void> {
    const video = document.getElementById(
      this.camera().id,
    ) as HTMLVideoElement | null;

    if (!video) return;

    try {
      if (document.pictureInPictureElement === video) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {
      // Picture-in-picture can fail when the OS or browser denies it; the
      // thumbnail view is unaffected.
    }
  }

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
