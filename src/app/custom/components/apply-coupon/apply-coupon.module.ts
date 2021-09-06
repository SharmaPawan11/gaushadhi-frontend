
import {NgModule} from "@angular/core";
import {ApplyCouponComponent} from "./apply-coupon.component";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    ApplyCouponComponent
  ],
  imports: [
  ],
  exports: [
    ApplyCouponComponent,
    MatButtonModule
  ]
})
export class ApplyCouponModule {}
