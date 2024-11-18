import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCameraComponent } from './edit-camera.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActiveCamerasService } from '../../../../shared/services/active-cameras.service';
import { StreamHelperService } from '../../../../shared/services/stream-helper.service';
import { CameraItem } from '../../../../shared/models/camera-item';
import { of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

describe('EditCameraComponent', () => {
  let component: EditCameraComponent;
  let fixture: ComponentFixture<EditCameraComponent>;
  let activeCamerasService: ActiveCamerasService;
  let toastrService: ToastrService;
  let streamHelperService: StreamHelperService;
  let changeDetectorRef: ChangeDetectorRef;

  const mockCamera: CameraItem = {
    id: 'cam1',
    title: 'Test Camera',
    streamUrl: 'http://test.com/stream.m3u8',
    localWebcam: false,
    selected: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [EditCameraComponent],
      providers: [
        FormBuilder,
        {
          provide: ActiveCamerasService,
          useValue: {
            updateCamera: jest.fn(),
          },
        },
        {
          provide: ToastrService,
          useValue: { error: jest.fn() },
        },
        {
          provide: StreamHelperService,
          useValue: { validateStreamUrl: jest.fn(() => of(true)) },
        },
        {
          provide: ChangeDetectorRef,
          useValue: { markForCheck: jest.fn() },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCameraComponent);
    component = fixture.componentInstance;
    activeCamerasService = TestBed.inject(ActiveCamerasService);
    toastrService = TestBed.inject(ToastrService);
    streamHelperService = TestBed.inject(StreamHelperService);
    changeDetectorRef = TestBed.inject(ChangeDetectorRef);

    fixture.componentRef.setInput('camera', mockCamera);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with camera data', () => {
    expect(component.cameraForm).toBeDefined();
    expect(component.cameraForm.controls['title'].value).toBe(mockCamera.title);
    expect(component.cameraForm.controls['streamUrl'].value).toBe(
      mockCamera.streamUrl,
    );
  });

  it('should submit the form and update the camera', async () => {
    const updatedCamera: CameraItem = {
      ...mockCamera,
      title: 'Updated Camera',
      streamUrl: 'http://newstream.com/stream.m3u8',
    };

    component.cameraForm.controls['title'].setValue(updatedCamera.title);
    component.cameraForm.controls['streamUrl'].setValue(
      updatedCamera.streamUrl,
    );

    jest.spyOn(activeCamerasService, 'updateCamera');
    await component.onSubmit();

    expect(activeCamerasService.updateCamera).toHaveBeenCalledWith(
      updatedCamera,
    );
  });

  it('should show an error if stream URL is invalid', async () => {
    jest
      .spyOn(streamHelperService, 'validateStreamUrl')
      .mockReturnValue(Promise.resolve(false));

    component.cameraForm.controls['streamUrl'].setValue('invalid-url');

    await component.onSubmit();

    expect(toastrService.error).toHaveBeenCalledWith(
      'Not valid stream url. Try a different.',
    );
  });

  it('should call closeDialog when closing the dialog', () => {
    component.closeDialog();
    expect(component.isDialogOpen()).toBe(false);
  });

  it('should mark for check after submitting the form', async () => {
    jest.spyOn(changeDetectorRef, 'markForCheck');

    await component.onSubmit();

    expect(changeDetectorRef.markForCheck).toHaveBeenCalled();
  });
});
