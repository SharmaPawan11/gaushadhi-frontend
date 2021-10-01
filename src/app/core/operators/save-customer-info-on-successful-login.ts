import {map, switchMap, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {OrderService} from "../providers/order.service";
import {GetAccountOverview} from "../../common/vendure-types";
import {GET_ACTIVE_CUSTOMER} from "../../common/documents.graph";
import {UserService} from "../providers/user.service";
import {RequestorService} from "../providers/requestor.service";

@Injectable({
  providedIn: 'root',
})
export class SaveCustomerInfoOnSuccessfulLogin {
  constructor(private userService: UserService,
              private requestor: RequestorService) {}

  operator() {
    return <T>(source: Observable<T>) => {
      return source.pipe(
        switchMap((res:any ) => {
          switch (res.__typename) {
            case 'NotVerifiedError':
            case 'InvalidCredentialsError':
            case 'NativeAuthStrategyError':
              console.log(res.message);
              return of({
                errorCode: res.errorCode,
                message: res.message,
              });
            case 'CurrentUser':
              console.log(res);
              this.userService.setUserDetails(res.id);
              console.log(localStorage.getItem('authToken'))
              return this.requestor
                .query<GetAccountOverview.Query>(GET_ACTIVE_CUSTOMER, {
                  includeAddress: false,
                  includeProfile: true,
                  includeOrder: false,
                })
                .pipe(
                  tap(console.log),
                  map((res) => res.activeCustomer),
                  tap((res) => {
                    if (res?.emailAddress) {
                      localStorage.setItem(
                        'customerName',
                        res.firstName + res.lastName
                      );
                      localStorage.setItem('customerEmail', res.emailAddress);
                      localStorage.setItem(
                        'customerPhNo',
                        (res as any).phoneNumber || undefined
                      );
                    }
                  })
                );
            default:
              return of(null);
          }
        }),
      )
    }
  }
}
