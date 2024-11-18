import { inject, Injectable, WritableSignal } from '@angular/core';
import Hls from 'hls.js';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class StreamHelperService {
  private toastr = inject(ToastrService);

  startStream(
    hlsInstance: Hls,
    video: HTMLVideoElement,
    streamUrl: string,
  ): void {
    if (Hls.isSupported()) {
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);

      this.errorMonitor(hlsInstance);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else {
      this.toastr.error('HLS not supported in this browser');
    }
  }

  finishLoading(
    hlsInstance: Hls,
    booleanSignal: WritableSignal<boolean>,
  ): void {
    hlsInstance.on(Hls.Events.BUFFER_APPENDED, () => {
      booleanSignal.set(false);
    });
  }

  async validateStreamUrl(streamUrl: string): Promise<boolean> {
    if (!Hls.isSupported()) return false;

    const hls = new Hls();
    hls.loadSource(streamUrl);

    return new Promise((resolve) => {
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        hls.destroy();
        resolve(true);
      });
      hls.on(Hls.Events.ERROR, () => {
        hls.destroy();
        resolve(false);
      });
    });
  }

  destroy(hlsInstance: Hls): void {
    hlsInstance.destroy();
  }

  private errorMonitor(hlsInstance: Hls): void {
    hlsInstance.on(Hls.Events.ERROR, (event, data) => {
      const { details, fatal } = data;

      const ERROR_PREFIX = 'HLS.js error detected: ';

      if (fatal) {
        this.toastr.error(ERROR_PREFIX + details.toString());
      } else {
        this.toastr.warning(ERROR_PREFIX + details.toString());
      }
    });
  }
}
