import { NgModule } from '@angular/core';
import { ProductsComponent } from './components/products/products.component';
import { ProductFilterComponent } from './components/product-filter/product-filter.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { routes } from './public-routes';
import { CartComponent } from './components/cart/cart.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormatPriceModule} from "../custom/pipes/format-price/format-price.module";
import {ApplyCouponModule} from "../custom/components/apply-coupon/apply-coupon.module";
import {OrderPriceBreakdownModule} from "../custom/components/order-price-breakdown/order-price-breakdown.module";
import {CheckboxModule} from "../custom/components/checkbox/checkbox.module";
import {TextWithToggleModule} from "../custom/components/text-with-toggle/text-with-toggle.module";
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
  declarations: [
    ProductsComponent,
    ProductFilterComponent,
    ProductListComponent,
    ProductDetailComponent,
    CartComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatExpansionModule,
    MatBadgeModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormatPriceModule,
    ApplyCouponModule,
    OrderPriceBreakdownModule,
    CheckboxModule,
    TextWithToggleModule,
    MatPaginatorModule
  ],
  exports: [],
})
export class PublicModule {}
