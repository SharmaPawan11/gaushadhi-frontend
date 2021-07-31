import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectAddressComponent } from './components/select-address/select-address.component';
import { SelectShipmentComponent } from './components/select-shipment/select-shipment.component';
import { OrderReviewComponent } from './components/order-review/order-review.component';
import { routes } from './checkout-routes';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    SelectAddressComponent,
    SelectShipmentComponent,
    OrderReviewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    FormsModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
  ],
})
export class CheckoutModule {}
