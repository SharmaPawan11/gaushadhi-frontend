
import {NgModule} from "@angular/core";
import {OrderPriceBreakdownComponent} from "./order-price-breakdown.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {CommonModule} from "@angular/common";
import {FormatPriceModule} from "../../pipes/format-price/format-price.module";
@NgModule({
  declarations: [
    OrderPriceBreakdownComponent
  ],
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    FormatPriceModule
  ],
  exports: [
    OrderPriceBreakdownComponent
  ]
})
export class OrderPriceBreakdownModule {}
