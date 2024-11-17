/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CameraContainerComponent } from './camera-container.component';

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
});
