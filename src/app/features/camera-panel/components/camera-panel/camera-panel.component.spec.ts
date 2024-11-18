/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CameraPanelComponent } from './camera-panel.component';
import { ActiveCamerasService } from '../../../../shared/services/active-cameras.service';

import { WebcamComponent } from '../webcam/webcam.component';
import { CameraStreamComponent } from '../camera-stream/camera-stream.component';
import { CameraItem } from '../../../../shared/models/camera-item';
import { ToastrService } from 'ngx-toastr';

const mockCameras: CameraItem[] = [
  { id: '1', title: 'title1', localWebcam: false },
  { id: '2', title: 'title2', localWebcam: false },
];

class MockToastrService {
  error(message: string) {
    return of(true);
  }
}

describe('CameraPanelComponent', () => {
  let activeCamerasServiceMock: jest.Mocked<ActiveCamerasService>;
  beforeEach(async () => {
    activeCamerasServiceMock = {
      getCameras$: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<ActiveCamerasService>;

    await TestBed.configureTestingModule({
      imports: [CameraPanelComponent, WebcamComponent, CameraStreamComponent],
      providers: [
        { provide: ActiveCamerasService, useValue: activeCamerasServiceMock },
        { provide: ToastrService, useClass: MockToastrService },
      ],
    }).compileComponents();

    activeCamerasServiceMock.getCameras$.mockReturnValue(of(mockCameras));
  });

  it('should create the CameraPanelComponent', () => {
    const fixture = TestBed.createComponent(CameraPanelComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should set the camerasActive when starts', () => {
    const fixture = TestBed.createComponent(CameraPanelComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.camerasActive).toEqual(mockCameras);
  });

  it('should return the correct grid class based on the number of cameras', () => {
    const fixture = TestBed.createComponent(CameraPanelComponent);
    const component = fixture.componentInstance;

    const testCases = [
      {
        cameras: [{ id: '1' } as CameraItem],
        expectedClass: 'grid grid-cols-1',
      },
      {
        cameras: [{ id: '1' } as CameraItem, { id: '2' } as CameraItem],
        expectedClass: 'grid grid-cols-2',
      },
      {
        cameras: [
          { id: '1' } as CameraItem,
          { id: '2' } as CameraItem,
          { id: '3' } as CameraItem,
          { id: '4' } as CameraItem,
        ],
        expectedClass: 'grid grid-cols-3',
      },
      {
        cameras: new Array(7).fill({ id: '1' } as CameraItem),
        expectedClass: 'grid grid-cols-4',
      },
    ];

    testCases.forEach(({ cameras, expectedClass }) => {
      component.camerasActive = cameras;
      expect(component.getGridClass()).toBe(expectedClass);
    });
  });
});
