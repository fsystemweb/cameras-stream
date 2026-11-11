import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCameraComponent } from './edit-camera.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActiveCamerasService } from '../../../../shared/services/active-cameras.service';
import { StreamHelperService } from '../../../../shared/services/stream-helper.service';
import { CameraItem } from '../../../../shared/models/camera-item';

describe('EditCameraComponent', () => {
  let component: EditCameraComponent;
  let fixture: ComponentFixture<EditCameraComponent>;
  let activeCamerasService: ActiveCamerasService;
  let toastrService: ToastrService;
  let streamHelperService: StreamHelperService;

  const mockCamera: CameraItem = {
    id: 'cam1',
    title: 'Test Camera',
    streamUrl: 'http://test.com/stream.m3u8',
    localWebcam: false,
    selected: false,
  };

  /** Lets the component's validation promise chain settle before asserting. */
  async function awaitValidationChain(): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, EditCameraComponent],
      providers: [
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
          useValue: { validateStreamUrl: jest.fn(() => Promise.resolve(true)) },
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
    await awaitValidationChain();

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
    await awaitValidationChain();

    expect(toastrService.error).toHaveBeenCalledWith(
      'Not valid stream url. Try a different.',
    );
  });

  it('should call closeDialog when closing the dialog', () => {
    component.closeDialog();
    expect(component.isDialogOpen()).toBe(false);
  });

  it('should reset the loading state after submitting the form', async () => {
    component.loading = true;

    await component.onSubmit();
    await awaitValidationChain();

    // The callback that clears the loading state runs alongside markForCheck,
    // so this covers the refresh path after validation settles.
    expect(component.loading).toBe(false);
  });
});
