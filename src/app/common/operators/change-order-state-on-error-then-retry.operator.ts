import {filter, map, retry} from "rxjs/operators";
import {Observable, of, switchMap} from "rxjs";
import {notNullOrNotUndefined} from "../utils/not-null-or-not-undefined";

export function changeOrderStateOnErrorThenRetry(transitionOrderStateObservable: Observable<any>) {
  return function<T>(source: Observable<T>) {
    return source.pipe(
      switchMap((res: any) => {
        if (res.__typename === 'Order') {
          return of(res);
        } else if (res.__typename === 'OrderModificationError' || (res.__typename === 'RazorpayOrderIdGenerationError' && res.errorCode === 'INVALID_ORDER_STATE_ERROR')) {
          return transitionOrderStateObservable.pipe(
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
