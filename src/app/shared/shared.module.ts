import { NgModule } from '@angular/core';
import { ConfirmInputComponent } from './components/confirm-password/confirm-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormcontrolToLabelPipe } from './pipes/formcontrol-to-label.pipe';

@NgModule({
  declarations: [ConfirmInputComponent, FormcontrolToLabelPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [],
  exports: [ConfirmInputComponent],
})
export class SharedModule {}
