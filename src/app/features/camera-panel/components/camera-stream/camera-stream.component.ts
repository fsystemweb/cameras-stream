import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import Hls from 'hls.js';

import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { StreamHelperService } from '../../../../shared/services/stream-helper.service';

@Component({
  selector: 'app-camera-stream',
  standalone: true,
  templateUrl: './camera-stream.component.html',
  imports: [SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraStreamComponent implements AfterViewInit, OnDestroy {
  private streamHelperService = inject(StreamHelperService);

  streamUrl = input.required<string>();
  id = input.required<string>();

  loading = signal(true);

  videoElement =
    viewChild.required<ElementRef<HTMLVideoElement>>('videoElement');

  hls = new Hls();

  ngAfterViewInit(): void {
    this.startStream();
  }

  startStream(): void {
    const video = this.videoElement().nativeElement;
    video.muted = true;

    const streamUrl = this.streamUrl();

    this.streamHelperService.startStream(this.hls, video, streamUrl);

    this.streamHelperService.finishLoading(this.hls, this.loading);
  }

  ngOnDestroy(): void {
    this.streamHelperService.destroy(this.hls);
  }
}
