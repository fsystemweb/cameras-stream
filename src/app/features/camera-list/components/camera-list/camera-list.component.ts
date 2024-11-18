import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CameraItem } from '../../models/camera-item';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'app-camera-list',
  standalone: true,
  templateUrl: './camera-list.component.html',
  imports: [ListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraListComponent {
  cameras: CameraItem[] = [
    {
      title: 'My Webcam',
      id: 'cam1',
      localWebcam: true,
    },
    {
      title: 'RTVE 24H',
      id: 'cam2',
      streamUrl: 'https://ztnr.rtve.es/ztnr/1694255.m3u8',
      localWebcam: false,
    },
    {
      title: 'Al Jazeera',
      id: 'cam3',
      streamUrl: 'https://live-hls-web-aja.getaj.net/AJA/index.m3u8',
      localWebcam: false,
    },
    {
      title: 'DW Español',
      id: 'cam4',
      streamUrl:
        'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
      localWebcam: false,
    },
    {
      title: 'NBC News NOW',
      id: 'cam5',
      streamUrl:
        'https://dai2.xumo.com/amagi_hls_data_xumo1212A-xumo-nbcnewsnow/CDN/master.m3u8',
      localWebcam: false,
    },
    {
      title: 'The Guardian',
      id: 'cam6',
      streamUrl: 'https://rakuten-guardian-1-ie.samsung.wurl.tv/playlist.m3u8',
      localWebcam: false,
    },
    {
      title: 'SABC News',
      id: 'cam7',
      streamUrl:
        'https://sabconetanw.cdn.mangomolo.com/news/smil:news.stream.smil/chunklist_b250000_t64MjQwcA==.m3u8',
      localWebcam: false,
    },
    {
      title: 'Clan TV',
      id: 'cam8',
      streamUrl:
        'https://rtvelivestream-clnx.rtve.es/rtvesec/clan/clan_main_720.m3u8',
      localWebcam: false,
    },
  ];
}
