/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListItemComponent } from './list-item.component';
import { ActiveCamerasService } from '../../../../shared/services/active-cameras.service';
import { of, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  StreamHealthService,
  StreamHealthStatus,
} from '../../../../shared/services/stream-health.service';

class MockActiveCamerasService {
  addCamera = jest.fn();
  removeCamera = jest.fn();
}

class MockToastrService {
  info(message: string) {
    return of(true);
  }
}

class MockStreamHealthService {
  private readonly subject = new Subject<Record<string, StreamHealthStatus>>();

  statuses$ = this.subject.asObservable();

  emit(cameraId: string, status: StreamHealthStatus): void {
    this.subject.next({ [cameraId]: status });
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
        {
          provide: StreamHealthService,
          useValue: new MockStreamHealthService(),
        },
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

  it('should start with an unknown stream health status', () => {
    expect(fixture.componentInstance.healthStatus).toBe('unknown');
    expect(fixture.componentInstance.healthDotClass()).toContain(
      'bg-slate-300',
    );
  });

  it('should track the stream health status emitted by the health service', () => {
    const healthService = TestBed.inject(
      StreamHealthService,
    ) as unknown as MockStreamHealthService;
    healthService.emit('1', 'live');

    expect(fixture.componentInstance.healthStatus).toBe('live');
    expect(fixture.componentInstance.healthDotClass()).toContain(
      'bg-green-500',
    );
  });

  it('should render a red health dot for offline streams', () => {
    const healthService = TestBed.inject(
      StreamHealthService,
    ) as unknown as MockStreamHealthService;
    healthService.emit('1', 'offline');

    expect(fixture.componentInstance.healthStatus).toBe('offline');
    expect(fixture.componentInstance.healthDotClass()).toContain('bg-red-500');
  });
});
