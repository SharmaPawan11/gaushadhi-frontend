import {Route} from "@angular/router";
import {ProductsComponent} from "./components/products/products.component";
import {ProductDetailComponent} from "./components/product-detail/product-detail.component";
import {CartComponent} from "./components/cart/cart.component";

export const routes: Route[] = [
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'products/:slug',
    component: ProductDetailComponent,
  },
  {
    path: 'cart',
    component: CartComponent
  },

];
