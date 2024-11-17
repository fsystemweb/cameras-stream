import { Injectable } from '@angular/core';
import Hls from 'hls.js';

@Injectable({
  providedIn: 'root',
})
export class StreamHelperService {
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
      console.error('HLS not supported in this browser');
    }
  }

  private errorMonitor(hlsInstance: Hls): void {
    hlsInstance.on(Hls.Events.ERROR, (event, data) => {
      const { type, details, fatal } = data;

      const ERROR_PREFIX = 'HLS.js error detected:';

      if (fatal) {
        console.error(ERROR_PREFIX, {
          type,
          details,
          fatal,
        });
      } else {
        console.warn(ERROR_PREFIX, {
          type,
          details,
          fatal,
        });
      }
    });
  }
}
