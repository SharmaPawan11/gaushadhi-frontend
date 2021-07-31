import { Injectable } from '@angular/core';
import { RequestorService } from './requestor.service';
import { gql } from 'apollo-angular';
import {
  AddPayment,
  ApplyCouponCodeResult,
  GetActiveOrder,
  GetEligiblePaymentMethods,
  SetShippingAddress,
  TransitionToAddingItems,
  TransitionToArrangingPayment,
} from '../../common/vendure-types';
import { map } from 'rxjs/operators';
import { GET_ACTIVE_ORDER } from '../../common/documents.graph';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  SET_ORDER_BILLING_ADDRESS_MUTATION = gql`
    mutation setOrderBillingAddress($createAddressInput: CreateAddressInput!) {
      setOrderBillingAddress(input: $createAddressInput) {
        ... on Order {
          id
        }
        ... on ErrorResult {
          message
          errorCode
        }
      }
    }
  `;

  SET_ORDER_SHIPPING_ADDRESS_MUTATION = gql`
    mutation setOrderShippingAddress($createAddressInput: CreateAddressInput!) {
      setOrderShippingAddress(input: $createAddressInput) {
        ... on Order {
          id
        }
        ... on ErrorResult {
          message
          errorCode
        }
      }
    }
  `;

  ADD_COUPON_TO_ORDER_MUTATION = gql`
    mutation addCouponToOrder($couponCode: String!) {
      applyCouponCode(couponCode: $couponCode) {
        __typename
        ... on Order {
          id
        }
        ... on ErrorResult {
          message
          errorCode
        }
      }
    }
  `;

  REMOVE_COUPON_FROM_ORDER_MUTATION = gql`
    mutation removeCouponCodeFromOrder($couponCode: String!) {
      removeCouponCode(couponCode: $couponCode) {
        __typename
        ... on Order {
          id
        }
      }
    }
  `;

  GET_ELIGIBLE_PAYMENT_METHODS = gql`
    query eligiblePaymentMethods {
      eligiblePaymentMethods {
        id
        code
        name
        isEligible
        description
        eligibilityMessage
      }
    }
  `;

  TRANSITION_ORDER_STATE_MUTATION = gql`
    mutation transitionOrder($orderState: String!) {
      transitionOrderToState(state: $orderState) {
        __typename
        ... on Order {
          id
          state
        }
        ... on OrderStateTransitionError {
          errorCode
          message
          toState
          fromState
          transitionError
        }
      }
    }
  `;

  GENERATE_RAZORPAY_ORDER_ID = gql`
    mutation generateRazorpayOrderId($vendureOrderId: ID!) {
      generateRazorpayOrderId(orderId: $vendureOrderId) {
        __typename
        ... on RazorpayOrderIdSuccess {
          razorpayOrderId
        }
        ... on RazorpayOrderIdGenerationError {
          errorCode
          message
        }
      }
    }
  `;

  ADD_PAYMENT_TO_ORDER_MUTATION = gql`
    mutation addPaymentToOrder($paymentInput: PaymentInput!) {
      addPaymentToOrder(input: $paymentInput) {
        __typename
        ... on Order {
          id
        }
        ... on PaymentFailedError {
          errorCode
          paymentErrorMessage
          message
        }
        ... on OrderPaymentStateError {
          errorCode
          message
        }
        ... on PaymentDeclinedError {
          message
          paymentErrorMessage
          errorCode
        }
      }
    }
  `;

  constructor(private requestor: RequestorService) {}

  setOrderShippingAddress(shippingAddress: Object = {}) {
    return this.requestor
      .mutate<SetShippingAddress.Mutation>(
        this.SET_ORDER_SHIPPING_ADDRESS_MUTATION,
        {
          createAddressInput: shippingAddress,
        }
      )
      .pipe(map((res) => res.setOrderShippingAddress));
  }

  setOrderBillingAddress(billingAddress: Object = {}) {
    return this.requestor
      .mutate(this.SET_ORDER_BILLING_ADDRESS_MUTATION, {
        createAddressInput: billingAddress,
      })
      .pipe(map((res) => res.setOrderBillingAddress));
  }

  getCurrentOrderDetails() {
    return this.requestor
      .query<GetActiveOrder.Query>(GET_ACTIVE_ORDER, {
        includeOrderAddress: false,
        includeSurcharges: false,
        includeDiscounts: false,
        includePromotions: false,
        includePayments: false,
        includeFulfillments: false,
        includeShippings: false,
        includeTaxSummary: false,
        includeHistory: false,
      })
      .pipe(map((res) => res.activeOrder));
  }

  addCouponToOrder(couponCode: string): Observable<ApplyCouponCodeResult> {
    return this.requestor
      .mutate(this.ADD_COUPON_TO_ORDER_MUTATION, {
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
      .mutate(this.REMOVE_COUPON_FROM_ORDER_MUTATION, {
        couponCode,
      })
      .pipe(
        map((res) => {
          return res.removeCouponCode;
        })
      );
  }

  getEligiblePaymentMethods() {
    return this.requestor
      .query<GetEligiblePaymentMethods.Query>(this.GET_ELIGIBLE_PAYMENT_METHODS)
      .pipe(
        map((res) => {
          return res.eligiblePaymentMethods;
        })
      );
  }

  transitionOrderState(orderState: 'AddingItems' | 'ArrangingPayment') {
    return this.requestor
      .mutate<
        TransitionToArrangingPayment.Mutation | TransitionToAddingItems.Mutation
      >(this.TRANSITION_ORDER_STATE_MUTATION, {
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
      .mutate(this.GENERATE_RAZORPAY_ORDER_ID, {
        vendureOrderId,
      })
      .pipe(map((res) => res.generateRazorpayOrderId));
  }

  addRazorpayPaymentToOrder(paymentMetadata: Object) {
    const addPaymentMutationVariable = {
      paymentInput: {
        method: 'razorpay',
        metadata: JSON.stringify(paymentMetadata),
      },
    };
    return this.requestor
      .mutate<AddPayment.Mutation>(
        this.ADD_PAYMENT_TO_ORDER_MUTATION,
        addPaymentMutationVariable
      )
      .pipe(map((res) => res.addPaymentToOrder));
  }
}
