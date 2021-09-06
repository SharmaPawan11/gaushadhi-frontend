import {filter, map, retry} from "rxjs/operators";
import {Observable, of, switchMap} from "rxjs";
import {notNullOrNotUndefined} from "../../common/utils/not-null-or-not-undefined";
import {OrderService} from "../providers/order.service";
import {Injectable, Injector} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class OnErrorChangeOrderStateThenRetry {
  constructor(
    private injector: Injector
  ) {
    console.log('Operator')
  }

  operator(changeToState: 'AddingItems' | 'ArrangingPayment') {
    return <T>(source: Observable<T>) => {
      return source.pipe(
        switchMap((res: any) => {
          if (res.__typename === 'Order') {
            return of(res);
          } else if (res.__typename === 'OrderModificationError' || (res.__typename === 'RazorpayOrderIdGenerationError' && res.errorCode === 'INVALID_ORDER_STATE_ERROR')) {
            return this.injector.get<OrderService>(OrderService).transitionOrderState(changeToState || 'AddingItems').pipe(
              map((res: any) => {
                if (res?.__typename === 'Order') {
                  throw new Error('RETRY_AFTER_STATE_CHANGE');
                } else{
                  throw new Error('UNEXPECTED_ERROR');
                }
              })
            )
          }
          return of(res)
        }),
        retry(1),
        filter(notNullOrNotUndefined)
      )
    }
  }
}


