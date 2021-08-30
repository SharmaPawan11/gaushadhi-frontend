import {tap} from "rxjs/operators";
import {Observable, of, switchMap} from "rxjs";

export function updateOrderDetailsGlobally(refreshOrderDetailsFunction: Function) {
  return function<T>(source: Observable<T>) {
    return source.pipe(
      tap((res:any) => {
        if (res?.__typename === 'Order' || res?.__typename === 'RazorpayOrderIdSuccess') {
          refreshOrderDetailsFunction()
        }
      })
    )
  }
}
