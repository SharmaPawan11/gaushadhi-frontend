import { Route } from '@angular/router';
import { ShellComponent } from './core/components/shell/shell.component';
import { AccountGuard } from './core/providers/guards/account.guard';
import { LandingPageComponent } from './core/components/landing-page/landing-page.component';
import {CategoryComponent} from "./core/components/category/category.component";

export const routes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        component: LandingPageComponent,
      },
      {
        path: 'category/:productCategory',
        component: CategoryComponent,
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
