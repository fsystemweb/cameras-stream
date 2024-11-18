import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  model,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CameraItem } from '../../../camera-list/models/camera-item';
import { StreamHelperService } from '../../../../shared/services/stream-helper.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-camera',
  templateUrl: './edit-camera.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCameraComponent {
  private formBuilder = inject(FormBuilder);
  private streamHelperService = inject(StreamHelperService);
  private ref = inject(ChangeDetectorRef);
  private toastr = inject(ToastrService);

  isDialogOpen = model<boolean>(false);
  camera = input.required<CameraItem>();

  title: string = '';
  streamUrl: string = '';
  cameraForm!: FormGroup;

  loading = false;

  constructor() {
    effect(() => {
      this.initForm();
    });
  }

  closeDialog(): void {
    this.isDialogOpen.set(false);
  }

  async onSubmit(): Promise<void> {
    this.loading = true;
    this.validateStreamUrl().then((validation) => {
      this.loading = false;
      this.ref.markForCheck();

      if (validation) {
        /* todo */
      } else {
        this.toastr.error('Not valid stream url. Try a different.');
      }
    });
  }

  private initForm(): void {
    const camera = { ...this.camera() };

    this.cameraForm = this.formBuilder.group({
      title: [camera.title, Validators.required],
      streamUrl: [camera.streamUrl],
    });
  }

  private async validateStreamUrl(): Promise<boolean> {
    if (this.camera().localWebcam) {
      return true;
    }

    const streamUrl = this.cameraForm.controls['streamUrl'].value;

    return this.streamHelperService.validateStreamUrl(streamUrl);
  }
}
