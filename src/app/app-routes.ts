import { Route } from '@angular/router';
import { ShellComponent } from './core/components/shell/shell.component';
import { AccountGuard } from './core/providers/guards/account.guard';
import { LandingPageComponent } from './core/components/landing-page/landing-page.component';
import { CategoryComponent } from './core/components/category/category.component';
import { ProductsComponent } from './public/components/products/products.component';
import { ProductDetailComponent } from './public/components/product-detail/product-detail.component';
import {PlaygroundComponent} from "./public/components/playground/playground.component";

export const routes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        component: LandingPageComponent
      },
      {
       path: 'store',
       loadChildren: () =>
         import('./public/public.module').then((mod) => mod.PublicModule),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./account/account.module').then((mod) => mod.AccountModule),
        canActivate: [AccountGuard],
      },
    ],
  },
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.module').then((mod) => mod.AuthModule),
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./checkout/checkout.module').then((mod) => mod.CheckoutModule),
    canActivate: [AccountGuard],
  },
];
