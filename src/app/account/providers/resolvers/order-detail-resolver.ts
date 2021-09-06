import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {OrderService} from "../../../core/providers/order.service";

@Injectable({
  providedIn: 'root',
})
export class OrderDetailResolver implements Resolve<any> {
  constructor(private orderService: OrderService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const orderCode = route.params.code;
    return this.orderService.getOrderDetailsByCode(orderCode).pipe(take(1));
  }
}
