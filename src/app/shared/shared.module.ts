import { NgModule } from '@angular/core';
import {ConfirmPasswordComponent} from "./components/confirm-password/confirm-password.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [ConfirmPasswordComponent],
  imports: [CommonModule,
    ReactiveFormsModule,
  MatInputModule,
    MatButtonModule,
  MatIconModule],
  providers: [],
  exports: [ConfirmPasswordComponent]
})
export class SharedModule {}
