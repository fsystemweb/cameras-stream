/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListItemComponent } from './list-item.component';
import { ActiveCamerasService } from '../../../../shared/services/active-cameras.service';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

class MockActiveCamerasService {
  addCamera = jest.fn();
  removeCamera = jest.fn();
}

class MockToastrService {
  info(message: string) {
    return of(true);
  }
}

describe('ListItemComponent', () => {
  let fixture: ComponentFixture<ListItemComponent>;
  let mockActiveCamerasService: MockActiveCamerasService;

  beforeEach(async () => {
    mockActiveCamerasService = new MockActiveCamerasService();

    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: jest.fn().mockResolvedValue({ getTracks: jest.fn() }),
      },
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [ListItemComponent],
      providers: [
        { provide: ActiveCamerasService, useValue: mockActiveCamerasService },
        { provide: ToastrService, useClass: MockToastrService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemComponent);
    const componentRef = fixture.componentRef;
    componentRef.setInput('cameraItem', {
      id: 1,
      title: 'Camera 1',
      localWebcam: true,
    });
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should check camera permission on initialization', () => {
    jest
      .spyOn(navigator.mediaDevices, 'getUserMedia')
      .mockResolvedValueOnce({} as MediaStream);
    (fixture.componentInstance as any).checkCameraPermission();
    expect(fixture.componentInstance.webcamPermission).toBe(true);
  });

  it('should handle camera permission failure gracefully', async () => {
    jest
      .spyOn(navigator.mediaDevices, 'getUserMedia')
      .mockRejectedValueOnce(new Error('Permission denied'));

    (fixture.componentInstance as any).checkCameraPermission();

    await fixture.whenStable();

    expect(fixture.componentInstance.webcamPermission).toBe(false);
  });
});
