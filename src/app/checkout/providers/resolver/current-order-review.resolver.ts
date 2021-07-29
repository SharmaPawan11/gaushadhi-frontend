import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { OrderService } from '../../../core/providers/order.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentOrderReviewResolver implements Resolve<any> {
  constructor(private orderService: OrderService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.orderService.getCurrentOrderDetails().pipe(take(1));
  }
}
