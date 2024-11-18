/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';

import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ToastrService } from 'ngx-toastr';
import { ElementRef, signal } from '@angular/core';
import { of } from 'rxjs';
import { CameraStreamComponent } from './camera-stream.component';
import { StreamHelperService } from '../../services/stream-helper.service';

class MockStreamHelperService {
  startStream = jest.fn();
  finishLoading = jest.fn();
}

class MockToastrService {
  error(message: string) {
    return of(true);
  }
}

describe('CameraStreamComponent', () => {
  let component: CameraStreamComponent;
  let fixture: ComponentFixture<CameraStreamComponent>;
  let streamHelperService: StreamHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpinnerComponent, CameraStreamComponent],
      providers: [
        { provide: StreamHelperService, useClass: MockStreamHelperService },
        { provide: ToastrService, useClass: MockToastrService },
      ],
    }).compileComponents();

    streamHelperService = TestBed.inject(StreamHelperService);

    fixture = TestBed.createComponent(CameraStreamComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'cam1');
    fixture.componentRef.setInput('streamUrl', 'url.com');
    const videoMock = {
      nativeElement: document.createElement('video'),
    } as ElementRef<HTMLVideoElement>;

    component.videoElement = signal(videoMock);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner while loading', () => {
    expect(component.loading()).toBe(true);
  });

  it('should configure video element when camera stream is received', async () => {
    await component.startStream();

    expect(streamHelperService.startStream).toHaveBeenCalled();

    expect(streamHelperService.finishLoading).toHaveBeenCalled();

    const video = component.videoElement().nativeElement;
    expect(video.muted).toBe(true);
  });
});
