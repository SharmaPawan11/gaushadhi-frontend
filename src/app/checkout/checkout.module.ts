import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingInfoComponent } from './components/shipping-info/shipping-info-component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { routes } from './checkout-routes';
import { RouterModule } from '@angular/router';
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
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormatPriceModule} from "../custom/pipes/format-price/format-price.module";
import {ApplyCouponModule} from "../custom/components/apply-coupon/apply-coupon.module";
import {OrderPriceBreakdownModule} from "../custom/components/order-price-breakdown/order-price-breakdown.module";
import {AddressCardModule} from "../custom/components/address-card/address-card.module";
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    ShippingInfoComponent,
    OrderSummaryComponent,
    CheckoutShellComponent,
    CheckoutStageIndicatorComponent,
    PlaygroundComponent,
    ShipmentMethodCardComponent,
    OrderPlacedComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    FormsModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormatPriceModule,
    ApplyCouponModule,
    OrderPriceBreakdownModule,
    AddressCardModule,
    MatDialogModule
  ],
})
export class CheckoutModule {}
