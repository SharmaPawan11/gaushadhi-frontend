import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ShippingService } from '../shipping.service';
import { take } from 'rxjs/operators';
import { OrderService } from '../../../core/providers/order.service';

@Injectable({
  providedIn: 'root',
})
export class EligiblePaymentMethodsResolver implements Resolve<any> {
  constructor(
    private shippingService: ShippingService,
    private orderService: OrderService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.orderService.getEligiblePaymentMethods().pipe(take(1));
  }
}
