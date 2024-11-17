import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import Hls from 'hls.js';
import { StreamHelperService } from '../../services/stream-helper.service';

@Component({
  selector: 'app-camera-stream',
  standalone: true,
  templateUrl: './camera-stream.component.html',
  imports: [],
})
export class CameraStreamComponent implements AfterViewInit {
  private streamHelperService = inject(StreamHelperService);

  streamUrl = input.required<string>();
  id = input.required<string>();

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

    this.streamHelperService.startStream(hls, video, streamUrl);
  }
}
