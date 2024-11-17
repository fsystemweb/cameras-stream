import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {
  display = input.required<boolean>();
}
