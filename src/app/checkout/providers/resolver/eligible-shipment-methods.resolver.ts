import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ShippingService } from '../shipping.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EligibleShipmentMethodsResolver implements Resolve<any> {
  constructor(private shippingService: ShippingService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.shippingService.getEligibleShippingMethods().pipe(take(1));
  }
}
