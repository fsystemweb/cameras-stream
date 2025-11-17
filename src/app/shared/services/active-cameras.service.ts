import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CameraItem } from '../models/camera-item';

@Injectable({
  providedIn: 'root',
})
export class ActiveCamerasService {
  private dataSubject: BehaviorSubject<CameraItem[]> = new BehaviorSubject<
    CameraItem[]
  >([
    {
      title: 'My Webcam',
      id: 'cam1',
      localWebcam: true,
      selected: false,
    },
    {
      title: 'RTVE 24H',
      id: 'cam2',
      streamUrl: 'https://ztnr.rtve.es/ztnr/1694255.m3u8',
      localWebcam: false,
      selected: false,
    },
    {
      title: 'Al Jazeera',
      id: 'cam3',
      streamUrl: 'https://live-hls-web-aja.getaj.net/AJA/index.m3u8',
      localWebcam: false,
      selected: false,
    },
    {
      title: 'DW Español',
      id: 'cam4',
      streamUrl:
        'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
      localWebcam: false,
      selected: false,
    },
    /*
    {
      title: 'NBC News NOW',
      id: 'cam5',
      streamUrl:
        'https://dai2.xumo.com/amagi_hls_data_xumo1212A-xumo-nbcnewsnow/CDN/master.m3u8',
      localWebcam: false,
      selected: false,
    },
    {
      title: 'The Guardian',
      id: 'cam6',
      streamUrl: 'https://rakuten-guardian-1-ie.samsung.wurl.tv/playlist.m3u8',
      localWebcam: false,
      selected: false,
    },*/
    {
      title: 'SABC News',
      id: 'cam7',
      streamUrl:
        'https://sabconetanw.cdn.mangomolo.com/news/smil:news.stream.smil/chunklist_b250000_t64MjQwcA==.m3u8',
      localWebcam: false,
      selected: false,
    },
    {
      title: 'Nature Time',
      id: 'cam8',
      streamUrl:
        'https://amg00090-amgnaturetimeemea-rakuten.amagi.tv/playlist.m3u8',
      localWebcam: false,
      selected: false,
    },
  ]);

  addCamera(cameraItem: CameraItem): void {
    cameraItem.selected = true;
    this.updateCamera(cameraItem);
  }

  removeCamera(cameraItem: CameraItem): void {
    cameraItem.selected = false;
    this.updateCamera(cameraItem);
  }

  getCameras$(): Observable<CameraItem[]> {
    return this.dataSubject.asObservable();
  }

  updateCamera(updatedCamera: CameraItem): void {
    const currentData = this.dataSubject.value;

    const updatedData = currentData.map((item) =>
      item.id === updatedCamera.id ? { ...item, ...updatedCamera } : item,
    );
    this.dataSubject.next(updatedData);
  }
}
