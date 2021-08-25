import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingInfoComponent } from './components/shipping-info/shipping-info-component';
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
import { CheckoutShellComponent } from './components/checkout-shell/checkout-shell.component';
import { CheckoutStageIndicatorComponent } from './components/checkout-stage-indicator/checkout-stage-indicator.component';
import { PlaygroundComponent } from './playground/playground.component';
import { ShipmentMethodCardComponent } from './components/shipment-method-card/shipment-method-card.component';
import { OrderPlacedComponent } from './components/order-placed/order-placed.component';

@NgModule({
  declarations: [
    ShippingInfoComponent,
    SelectShipmentComponent,
    OrderReviewComponent,
    CheckoutShellComponent,
    CheckoutStageIndicatorComponent,
    PlaygroundComponent,
    ShipmentMethodCardComponent,
    OrderPlacedComponent,
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
