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
          // console.log(res);
          if (res?.__typename === 'Order' || res?.__typename === 'RazorpayOrderIdSuccess' || res?.__typename === 'InsufficientStockError' || res.__typename === 'CurrentUser' || res.__typename === 'Success') {
            this.orderService.refreshOrderDetails();
          }
        })
      )
    }
  }
}

