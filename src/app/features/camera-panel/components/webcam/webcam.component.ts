import { Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NavigatorHelperService } from '../../../../shared/services/navigator-helper.service';

@Component({
  selector: 'app-webcam',
  standalone: true,
  templateUrl: './webcam.component.html',
  imports: [],
})
export class WebcamComponent {
  private navigatorHelperService = inject(NavigatorHelperService);
  private toastr = inject(ToastrService);

  videoElement =
    viewChild.required<ElementRef<HTMLVideoElement>>('videoElement');
  id = input.required<string>();

  constructor() {
    this.startWebcam();
  }

  startWebcam(): void {
    this.navigatorHelperService
      .getMediaService()
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
