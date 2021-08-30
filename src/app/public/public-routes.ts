import { Route } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductDetailsResolver } from './providers/resolvers/product-details.resolver';
import { CurrentOrderDetailsResolver } from '../core/providers/resolvers/current-order-details.resolver';

export const routes: Route[] = [
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'products/:slug',
    component: ProductDetailComponent,
    resolve: {
      productDetails: ProductDetailsResolver,
    },
    runGuardsAndResolvers: 'paramsChange',
  },
  {
    path: 'cart',
    component: CartComponent,
  },
];
