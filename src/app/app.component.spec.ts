import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { WebcamComponent } from './features/camera-panel/components/webcam/webcam.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: jest.fn().mockResolvedValue({ getTracks: jest.fn() }),
      },
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent, WebcamComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the cameras-stream title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('StreamCam Manager');
  });
});
