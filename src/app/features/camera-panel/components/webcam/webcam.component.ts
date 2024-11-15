import { Component, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-webcam',
  standalone: true,
  templateUrl: './webcam.component.html',
  imports: [],
})
export class WebcamComponent {
  videoElement =
    viewChild.required<ElementRef<HTMLVideoElement>>('videoElement');

  constructor() {
    this.startWebcam();
  }

  startWebcam(): void {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = this.videoElement().nativeElement;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error('Error accessing webcam:', err);
      });
  }
}
