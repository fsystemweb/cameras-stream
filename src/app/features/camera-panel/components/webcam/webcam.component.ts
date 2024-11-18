import {
  Component,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NavigatorHelperService } from '../../../../shared/services/navigator-helper.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-webcam',
  standalone: true,
  templateUrl: './webcam.component.html',
  imports: [SpinnerComponent],
})
export class WebcamComponent {
  private navigatorHelperService = inject(NavigatorHelperService);
  private toastr = inject(ToastrService);

  id = input.required<string>();
  loading = signal(true);

  videoElement =
    viewChild.required<ElementRef<HTMLVideoElement>>('videoElement');

  constructor() {
    this.startWebcam();
  }

  startWebcam(): void {
    this.navigatorHelperService
      .getMediaService()
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = this.videoElement().nativeElement;
        this.navigatorHelperService.onLoading(video, this.loading);
        video.muted = true;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        this.toastr.error('Error accessing webcam', err);
      });
  }
}
