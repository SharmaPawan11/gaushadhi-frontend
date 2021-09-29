import { Route } from '@angular/router';
import { ShellComponent } from './core/components/shell/shell.component';
import { AccountGuard } from './core/providers/guards/account.guard';
import { LandingPageComponent } from './core/components/landing-page/landing-page.component';

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
        path: 'store',
        loadChildren: () =>
          import('./public/public.module').then((mod) => mod.PublicModule),
        data: {
          preload: true,
          loadAfterSeconds: 2
        }
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./account/account.module').then((mod) => mod.AccountModule),
        canActivate: [AccountGuard],
        data: {
          preload: true,
          loadAfterSeconds: 4
        }
      },
    ],
  },
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.module').then((mod) => mod.AuthModule),
    data: {
      preload: true,
      loadAfterSeconds: 3
    }
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./checkout/checkout.module').then((mod) => mod.CheckoutModule),
    data: {
      preload: true,
      loadAfterSeconds: 5
    }
    // canActivate: [AccountGuard],
  },
];
