import {Injectable} from '@angular/core';
import { RequestorService } from './requestor.service';
import {
  ApplyCouponCodeResult, Mutation,
  Order, OrderListOptions, Query
} from '../../common/vendure-types';
import {map, filter, tap, take, catchError} from 'rxjs/operators';
import {GET_ACTIVE_CUSTOMER, GET_ACTIVE_ORDER} from '../../common/documents.graph';
import {
  BehaviorSubject, forkJoin,
  Observable, of,
  Subject,
  switchMap,
} from 'rxjs';
import { notNullOrNotUndefined } from '../../common/utils/not-null-or-not-undefined';
import {ShippingService} from "../../checkout/providers/shipping.service";
import {
  OnErrorChangeOrderStateThenRetry
} from "../operators/on-error-change-order-state-then-retry.operator";
import {
  ADD_COUPON_TO_ORDER_MUTATION,
  ADD_PAYMENT_TO_ORDER_MUTATION,
  GENERATE_RAZORPAY_ORDER_ID,
  GET_ELIGIBLE_PAYMENT_METHODS,
  GET_ORDER_DETAILS_BY_CODE,
  REMOVE_COUPON_FROM_ORDER_MUTATION,
  SET_ORDER_BILLING_ADDRESS_MUTATION,
  SET_ORDER_SHIPPING_ADDRESS_MUTATION,
  TRANSITION_ORDER_STATE_MUTATION
} from "./order-mutations";

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private currentOrderDetails = new BehaviorSubject<any>(null);
  currentOrderDetails$: Observable<any> =
    this.currentOrderDetails.asObservable();
  private refreshOrderDetails$ = new Subject<any>();



  constructor(private requestor: RequestorService,
              private shippingService: ShippingService,
              private onErrorChangeStateThenRetry: OnErrorChangeOrderStateThenRetry) {
    this.refreshOrderDetails$
      .pipe(
        filter(
          (resTypename: string) =>
            resTypename === 'Order' || resTypename === 'InsufficientStockError'
        ),
        switchMap(() => {
          return this.requestCurrentOrderDetails().pipe(catchError((err) =>  {
            console.log(err);
            return of(null);
          }));
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        }),
        // filter(notNullOrNotUndefined)
      )
      .subscribe((res) => {
        if (res && res.__typename === 'Order') {
          const { __typename, ...orderDetails } = res;
          this.currentOrderDetails.next(orderDetails);
        } else {
          this.currentOrderDetails.next(null);
        }
      });
  }

  refreshOrderDetails(resTypename: string = 'Order') {
    console.log('refreshing');
    this.refreshOrderDetails$.next(resTypename);
  }

  setOrderShippingAddress(shippingAddress: any): Observable<Mutation["setOrderShippingAddress"]> {
    return this.requestor
      .mutate(
        SET_ORDER_SHIPPING_ADDRESS_MUTATION,
        {
          createAddressInput: shippingAddress,
        }
      )
      .pipe(map((res) => res.setOrderShippingAddress));
  }

  setOrderBillingAddress(billingAddress: any) {
    return this.requestor
      .mutate(SET_ORDER_BILLING_ADDRESS_MUTATION, {
        createAddressInput: billingAddress,
      })
      .pipe(map((res) => res.setOrderBillingAddress));
  }

  requestCurrentOrderDetails(): Observable<Query["activeOrder"]> {
    return this.requestor
      .query(GET_ACTIVE_ORDER, {
        includeOrderAddress: true,
        includeSurcharges: false,
        includeDiscounts: true,
        includePromotions: false,
        includePayments: false,
        includeFulfillments: false,
        includeShippings: true,
        includeTaxSummary: false,
        includeHistory: false,
      }, 'no-cache')
      .pipe(map((res) => res.activeOrder));
  }

  setShippingInfo(shippingAddress: any, billingAddress: any, shippingMethodId: number| string) {
    const setOrderShippingAddress$ = this
      .setOrderShippingAddress(shippingAddress)
      .pipe(take(1));
    const setOrderBillingAddress$ = this
      .setOrderBillingAddress(billingAddress)
      .pipe(take(1));
    const setShipmentMethod$ = this.shippingService
      .setOrderShippingMethod(shippingMethodId)
      .pipe(this.onErrorChangeStateThenRetry.operator('AddingItems'));

    return forkJoin([
      setOrderShippingAddress$,
      setOrderBillingAddress$,
    ]).pipe(
      switchMap(([shippingAddressRes, billingAddressRes]) => {
        if (shippingAddressRes.__typename === 'Order' &&
          billingAddressRes.__typename === 'Order') {
          return setShipmentMethod$
        }
        return of(null);
      }),
      filter(notNullOrNotUndefined)
    )
  }

  addCouponToOrder(couponCode: string): Observable<ApplyCouponCodeResult> {
    return this.requestor
      .mutate(ADD_COUPON_TO_ORDER_MUTATION, {
        couponCode,
      })
      .pipe(
        map((res) => {
          return res.applyCouponCode;
        })
      );
  }

  removeCouponFromOrder(couponCode: string): Observable<ApplyCouponCodeResult> {
    return this.requestor
      .mutate(REMOVE_COUPON_FROM_ORDER_MUTATION, {
        couponCode,
      })
      .pipe(
        map((res) => {
          return res.removeCouponCode;
        })
      );
  }

  getEligiblePaymentMethods(): Observable<Query["eligiblePaymentMethods"]> {
    return this.requestor
      .query(GET_ELIGIBLE_PAYMENT_METHODS)
      .pipe(
        map((res) => {
          return res.eligiblePaymentMethods;
        })
      );
  }

  transitionOrderState(orderState: 'AddingItems' | 'ArrangingPayment'): Observable<Mutation["transitionOrderToState"]> {
    return this.requestor
      .mutate(TRANSITION_ORDER_STATE_MUTATION, {
        orderState,
      })
      .pipe(
        map((res) => {
          return res.transitionOrderToState;
        })
      );
  }

  generateRazorpayOrderId(vendureOrderId: string | number) {
    return this.requestor
      .mutate(GENERATE_RAZORPAY_ORDER_ID, {
        vendureOrderId,
      })
      .pipe(map((res) => res.generateRazorpayOrderId),
        this.onErrorChangeStateThenRetry.operator('ArrangingPayment'));

  }

  addRazorpayPaymentToOrder(paymentMetadata: Object): Observable<Mutation["addPaymentToOrder"]> {
    const addPaymentMutationVariable = {
      paymentInput: {
        method: 'razorpay',
        metadata: JSON.stringify(paymentMetadata),
      },
    };
    return this.requestor
      .mutate(
        ADD_PAYMENT_TO_ORDER_MUTATION,
        addPaymentMutationVariable
      )
      .pipe(map((res) => res.addPaymentToOrder));
  }

  getOrdersList(orderListOptions: OrderListOptions): Observable<Query["activeCustomer"]> {
    return this.requestor.query(GET_ACTIVE_CUSTOMER, {
      includeOrder: true,
      includeAddress: false,
      includeProfile: false,
      orderOptions: orderListOptions
    })
      .pipe(map((res) => res.activeCustomer))
  }

  getOrderDetailsByCode(orderCode: string): Observable<Query["orderByCode"]> {
    return this.requestor.query(GET_ORDER_DETAILS_BY_CODE, {
      orderCode
    }).pipe(map(res => res.orderByCode))
  }
}
