import {catchError, filter, map, retry, switchMapTo, take, tap} from "rxjs/operators";
import {Observable, of, switchMap, throwError} from "rxjs";
import {notNullOrNotUndefined} from "../../common/utils/not-null-or-not-undefined";
import {Injectable} from "@angular/core";
import {ShippingService} from "../../checkout/providers/shipping.service";
import {UpdateOrderDetailsGlobally} from "./update-order-details-globally.operator";

@Injectable({
  providedIn: 'root',
})
export class SetDefaultShippingOnFirstItemAdd {
  constructor(
    private shippingService: ShippingService,
    private updateOrderDetailsGlobally: UpdateOrderDetailsGlobally
  ) {}

  operator() {
    return <T>(source: Observable<T>) => {
      return source.pipe(
        tap((res: any) => {
          if (!(res && res.shippingLines && res.shippingLines.length) && res.__typename === 'Order') {
            this.shippingService.getEligibleShippingMethods().
              pipe(
                switchMap((res: any) => {
                  const standardShipping = res.find((shipmentMethod: any) => {
                    return shipmentMethod.code === 'standard-shipping'
                  })
                  if (standardShipping?.id) {
                    return this.shippingService.setOrderShippingMethod(standardShipping.id)
                  }
                  return throwError(() => 'Error while getting eligible shipment method');
                }),
                catchError(() => of(null)),
                filter(notNullOrNotUndefined),
                this.updateOrderDetailsGlobally.operator(),
                take(1)
              )
              .subscribe(console.log);
          }
        })
      )
    }
  }
}


