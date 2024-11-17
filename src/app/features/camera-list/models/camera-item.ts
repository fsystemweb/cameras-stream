export class CameraItem {
  id: string;
  title: string;
  localWebcam: boolean = false;
  streamUrl?: string;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }
}
