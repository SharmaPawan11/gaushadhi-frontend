import { Route } from '@angular/router';
import { CoreComponent } from './core/core.component';

export const routes: Route[] = [
  {
    path: '',
    component: CoreComponent,
    // children: [
    //   {
    //     path: 'home',
    //   },
    // ],
  },
];
