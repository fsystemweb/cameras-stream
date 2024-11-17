import { Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-webcam',
  standalone: true,
  templateUrl: './webcam.component.html',
  imports: [],
})
export class WebcamComponent {
  private toastr = inject(ToastrService);

  videoElement =
    viewChild.required<ElementRef<HTMLVideoElement>>('videoElement');
  id = input.required<string>();

  constructor() {
    this.startWebcam();
  }

  startWebcam(): void {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = this.videoElement().nativeElement;
        video.muted = true;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        this.toastr.error('Error accessing webcam', err);
      });
  }
}
