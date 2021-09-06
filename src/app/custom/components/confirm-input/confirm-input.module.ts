
import {NgModule} from "@angular/core";
import {ConfirmInputComponent} from "./confirm-input.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {FormcontrolToLabelModule} from "../../pipes/formcontrol-to-label/formcontrol-to-label.module";

@NgModule({
  declarations: [
    ConfirmInputComponent
  ],
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    FormcontrolToLabelModule
  ],
  exports: [
    ConfirmInputComponent
  ]
})
export class ConfirmInputModule {}
