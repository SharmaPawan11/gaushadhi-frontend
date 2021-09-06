import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { OrderService } from '../order.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentOrderDetailsResolver implements Resolve<any> {
  constructor(private orderService: OrderService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.orderService.currentOrderDetails$.pipe(take(1));
  }
}
