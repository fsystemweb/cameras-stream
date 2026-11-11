/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CameraContainerComponent } from './camera-container.component';
import {
  StreamHealthService,
  StreamHealthStatus,
} from '../../../../shared/services/stream-health.service';
import { BehaviorSubject, Observable } from 'rxjs';

class MockStreamHealthService {
  private readonly subject = new BehaviorSubject<
    Record<string, StreamHealthStatus>
  >({});

  readonly statuses$: Observable<Record<string, StreamHealthStatus>> =
    this.subject.asObservable();

  setStatus(cameraId: string, status: StreamHealthStatus): void {
    this.subject.next({ ...this.subject.value, [cameraId]: status });
  }
}

describe('CameraContainerComponent', () => {
  let component: CameraContainerComponent;
  let fixture: ComponentFixture<CameraContainerComponent>;

  beforeEach(async () => {
    const mockGetContext = jest.fn().mockReturnValue({
      drawImage: jest.fn(),
    });

    HTMLCanvasElement.prototype.getContext = mockGetContext;

    const mockVideoElement = document.createElement('video');
    mockVideoElement.id = 'cam1';
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      return id === 'cam1' ? mockVideoElement : null;
    });

    await TestBed.configureTestingModule({
      imports: [CameraContainerComponent],
      providers: [
        {
          provide: StreamHealthService,
          useValue: new MockStreamHealthService(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CameraContainerComponent);
    component = fixture.componentInstance;
    const componentRef = fixture.componentRef;

    componentRef.setInput('camera', {
      id: 'cam1',
      title: 'camera 1',
      localWebcam: true,
    });
  });

  it('should take a snapshot and set snapshotUrls', () => {
    component.takeSnapshot();
    fixture.detectChanges();

    expect(component.snapshotUrls).not.toBe('');
  });

  it('should call downloadFile after taking a snapshot', () => {
    jest.spyOn(component as any, 'downloadFile');
    component.takeSnapshot();
    fixture.detectChanges();

    expect((component as any).downloadFile).toHaveBeenCalled();
  });

  it('should display the camera health status chip', () => {
    const { healthService, cam } = setupStreamCamera();

    healthService.setStatus(cam.id, 'live');
    fixture.detectChanges();

    expect(document.body.textContent).toContain('Live');
  });

  it('should label offline streams as offline', () => {
    const { healthService, cam } = setupStreamCamera();

    healthService.setStatus(cam.id, 'offline');
    fixture.detectChanges();

    expect(component.healthStatus).toBe('offline');
    expect(component.healthLabel()).toBe('Offline');
  });

  it('should label the probe status as checking while unknown', () => {
    setupStreamCamera();
    expect(component.healthStatus).toBe('unknown');
    expect(component.healthLabel()).toBe('Checking…');
  });

  it('exits picture in picture when the camera is already floating', async () => {
    setupStreamCamera();
    const video = document.createElement('video');
    video.id = 'stream-cam';
    jest.spyOn(document, 'getElementById').mockReturnValue(video);
    Object.defineProperty(document, 'pictureInPictureElement', {
      value: video,
      configurable: true,
    });
    const exitStub = jest.fn(() => Promise.resolve());
    Object.defineProperty(document, 'exitPictureInPicture', {
      value: exitStub,
      configurable: true,
    });

    await component.togglePictureInPicture();

    expect(exitStub).toHaveBeenCalled();
  });

  it('enters picture in picture for a video that is not floating', async () => {
    setupStreamCamera();
    const video = document.createElement('video');
    video.id = 'stream-cam';
    jest.spyOn(document, 'getElementById').mockReturnValue(video);
    Object.defineProperty(document, 'pictureInPictureElement', {
      value: null,
      configurable: true,
    });
    const requestStub = jest.fn(() => Promise.resolve());
    Object.defineProperty(video, 'requestPictureInPicture', {
      value: requestStub,
      configurable: true,
    });

    await component.togglePictureInPicture();

    expect(requestStub).toHaveBeenCalled();
  });

  it('does nothing when picture in picture has no video element', async () => {
    setupStreamCamera();
    jest.spyOn(document, 'getElementById').mockReturnValue(null);

    await expect(component.togglePictureInPicture()).resolves.not.toThrow;
  });

  function setupStreamCamera(): {
    healthService: MockStreamHealthService;
    cam: { id: string };
  } {
    const healthService = TestBed.inject(
      StreamHealthService,
    ) as unknown as MockStreamHealthService;
    const cam = {
      id: 'stream-cam',
      title: 'Live stream',
      streamUrl: 'https://example.com/live.m3u8',
      localWebcam: false,
    };
    fixture.componentRef.setInput('camera', cam);
    fixture.detectChanges();
    return { healthService, cam };
  }
});
