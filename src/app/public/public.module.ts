import {NgModule} from "@angular/core";
import {ProductsComponent} from "./components/products/products.component";
import {ProductFilterComponent} from "./components/product-filter/product-filter.component";
import {ProductListComponent} from "./components/product-list/product-list.component";
import {ProductDetailComponent} from "./components/product-detail/product-detail.component";
import {PlaygroundComponent} from "./components/playground/playground.component";
import {RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {SharedModule} from "../shared/shared.module";
import {MatChipsModule} from "@angular/material/chips";
import {MatTabsModule} from "@angular/material/tabs";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatBadgeModule} from "@angular/material/badge";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {routes} from "./public-routes";
import { CartComponent } from './components/cart/cart.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductFilterComponent,
    ProductListComponent,
    ProductDetailComponent,
    PlaygroundComponent,
    CartComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    SharedModule,
    MatChipsModule,
    MatTabsModule,
    MatExpansionModule,
    MatBadgeModule,
    MatButtonModule
  ],
  exports: []
})
export class PublicModule {}
