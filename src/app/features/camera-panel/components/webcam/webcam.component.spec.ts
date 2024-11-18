/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { WebcamComponent } from './webcam.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ToastrService } from 'ngx-toastr';
import { NavigatorHelperService } from '../../../../shared/services/navigator-helper.service';
import { ElementRef, signal } from '@angular/core';
import { of } from 'rxjs';

class MockNavigatorHelperService {
  getMediaService = jest.fn(() => ({
    getUserMedia: jest.fn().mockResolvedValue({} as MediaStream),
  }));

  onLoading = jest.fn();
}

class MockToastrService {
  error(message: string) {
    return of(true);
  }
}

describe('WebcamComponent', () => {
  let component: WebcamComponent;
  let fixture: ComponentFixture<WebcamComponent>;
  let navigatorHelperService: NavigatorHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpinnerComponent, WebcamComponent],
      providers: [
        {
          provide: NavigatorHelperService,
          useClass: MockNavigatorHelperService,
        },
        { provide: ToastrService, useClass: MockToastrService },
      ],
    }).compileComponents();

    navigatorHelperService = TestBed.inject(NavigatorHelperService);

    fixture = TestBed.createComponent(WebcamComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'cam1');
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

  it('should configure video element when webcam stream is received', async () => {
    await component.startWebcam();

    expect(navigatorHelperService.onLoading).toHaveBeenCalledWith(
      component.videoElement().nativeElement,
      component.loading,
    );

    const video = component.videoElement().nativeElement;
    expect(video.muted).toBe(true);
  });
});
