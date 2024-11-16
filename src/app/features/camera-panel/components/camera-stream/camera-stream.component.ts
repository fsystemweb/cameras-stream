import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import Hls from 'hls.js';

@Component({
  selector: 'app-camera-stream',
  standalone: true,
  templateUrl: './camera-stream.component.html',
  imports: [],
})
export class CameraStreamComponent implements AfterViewInit {
  streamUrl = input.required<string>();

  videoElement =
    viewChild.required<ElementRef<HTMLVideoElement>>('videoElement');

  ngAfterViewInit(): void {
    this.startStream();
  }

  startStream(): void {
    const video = this.videoElement().nativeElement;
    video.muted = true;
    const hls = new Hls();
    const streamUrl = this.streamUrl();

    if (Hls.isSupported()) {
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else {
      console.error('HLS not supported in this browser');
    }
  }
}
