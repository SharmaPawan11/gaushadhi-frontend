import { Route } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddressComponent } from './components/address/address.component';
import { AddressResolver } from '../core/providers/resolvers/address.resolver';
import { ProfileResolver } from './providers/resolvers/profile.resolver';
import { ChangeEmailAddressComponent } from './components/change-email-address/change-email-address.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

export const routes: Route[] = [
  {
    path: '',
    component: SidebarComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile',
      },
      {
        path: 'orders',
        component: OrderListComponent,
      },
      {
        path: 'orders/:id',
        component: OrderDetailsComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
        resolve: {
          profile: ProfileResolver,
        },
      },
      {
        path: 'address',
        component: AddressComponent,
        resolve: {
          addresses: AddressResolver,
        },
      },
      {
        path: 'update',
        children: [
          {
            path: 'email',
            component: ChangeEmailAddressComponent,
          },
          {
            path: 'password',
            component: ChangePasswordComponent,
          },
        ],
      },
    ],
  },
];
