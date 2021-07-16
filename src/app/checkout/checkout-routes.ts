import { Route } from '@angular/router';
import { SelectAddressComponent } from './components/select-address/select-address.component';
import { SelectShipmentComponent } from './components/select-shipment/select-shipment.component';
import { OrderReviewComponent } from './components/order-review/order-review.component';
import { AddressResolver } from '../core/providers/resolvers/address.resolver';
import { EligibleShipmentMethodsResolver } from './providers/resolver/eligible-shipment-methods.resolver';

export const routes: Route[] = [
  {
    path: 'select-address',
    component: SelectAddressComponent,
    resolve: {
      addresses: AddressResolver,
    },
  },
  {
    path: 'select-shipment',
    component: SelectShipmentComponent,
    resolve: {
      eligibleShipmentMethods: EligibleShipmentMethodsResolver,
    },
  },
  {
    path: 'review',
    component: OrderReviewComponent,
  },
];
