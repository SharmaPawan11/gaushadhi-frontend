import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {OrderService} from "../../../core/providers/order.service";
import {SortOrder} from "../../../common/vendure-types";

@Injectable({
  providedIn: 'root',
})
export class OrderListResolver implements Resolve<any> {
  constructor(private orderService: OrderService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.orderService.getOrdersList({
      sort: {
        orderPlacedAt: SortOrder.DESC
      }
    }).pipe(take(1));
  }
}
