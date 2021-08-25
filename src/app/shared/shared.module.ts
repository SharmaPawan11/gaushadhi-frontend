import { NgModule } from '@angular/core';
import { ConfirmInputComponent } from './components/confirm-input/confirm-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormcontrolToLabelPipe } from './pipes/formcontrol-to-label.pipe';
import { AddressCardComponent } from './components/address-card/address-card.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { TextWithToggleComponent } from './components/text-with-toggle/text-with-toggle.component';
import { OrderPriceBreakdownComponent } from './components/order-price-breakdown/order-price-breakdown.component';
import { ApplyCouponComponent } from './components/apply-coupon/apply-coupon.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    ConfirmInputComponent,
    FormcontrolToLabelPipe,
    AddressCardComponent,
    AddressFormComponent,
    CheckboxComponent,
    TextWithToggleComponent,
    OrderPriceBreakdownComponent,
    ApplyCouponComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDialogModule
  ],
  providers: [],
  exports: [
    ConfirmInputComponent,
    AddressCardComponent,
    AddressFormComponent,
    CheckboxComponent,
    TextWithToggleComponent,
    OrderPriceBreakdownComponent,
    ApplyCouponComponent,
  ],
})
export class SharedModule {}
