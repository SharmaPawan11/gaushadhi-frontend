import { Route } from '@angular/router';
import { ShippingInfoComponent } from './components/shipping-info/shipping-info-component';
import { OrderReviewComponent } from './components/order-review/order-review.component';
import { AddressResolver } from '../core/providers/resolvers/address.resolver';
import { EligibleShipmentMethodsResolver } from './providers/resolver/eligible-shipment-methods.resolver';
import { CurrentOrderReviewResolver } from './providers/resolver/current-order-review.resolver';
import { EligiblePaymentMethodsResolver } from './providers/resolver/eligible-payment-methods.resolver';
import { CheckoutShellComponent } from './components/checkout-shell/checkout-shell.component';
import { PlaygroundComponent } from './playground/playground.component';
import { OrderPlacedComponent } from './components/order-placed/order-placed.component';

export const routes: Route[] = [
  {
    path: 'playground',
    component: PlaygroundComponent,
  },
  {
    path: '',
    component: CheckoutShellComponent,
    children: [
      {
        path: 'shipping-info',
        component: ShippingInfoComponent,
        resolve: {
          addresses: AddressResolver,
          eligibleShipmentMethods: EligibleShipmentMethodsResolver,
        },
      },
      {
        path: 'summary',
        component: OrderReviewComponent,
        resolve: {
          currentOrderReview: CurrentOrderReviewResolver,
          eligiblePaymentMethods: EligiblePaymentMethodsResolver,
        },
      },
      {
        path: 'order-placed',
        component: OrderPlacedComponent,
      },
    ],
  },
];
