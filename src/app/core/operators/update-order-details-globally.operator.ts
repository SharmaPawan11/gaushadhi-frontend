import {tap} from "rxjs/operators";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {OrderService} from "../providers/order.service";

@Injectable({
  providedIn: 'root',
})
export class UpdateOrderDetailsGlobally {
  constructor(private orderService: OrderService) {}

  operator() {
    return <T>(source: Observable<T>) => {
      return source.pipe(
        tap((res:any) => {
          if (res?.__typename === 'Order' || res?.__typename === 'RazorpayOrderIdSuccess' || res?.__typename === 'InsufficientStockError') {
            this.orderService.refreshOrderDetails();
          }
        })
      )
    }
  }
}

