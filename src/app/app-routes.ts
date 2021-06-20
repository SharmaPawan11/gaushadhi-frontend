import { Route } from '@angular/router';
import { CoreComponent } from './core/core.component';

export const routes: Route[] = [
  {
    path: '',
    component: CoreComponent,
  },
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.module').then((mod) => mod.AuthModule),
  },
];
