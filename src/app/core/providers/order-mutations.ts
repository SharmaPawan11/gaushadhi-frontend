import {gql} from "apollo-angular";

export const SET_ORDER_BILLING_ADDRESS_MUTATION = gql`
    mutation setOrderBillingAddress($createAddressInput: CreateAddressInput!) {
      setOrderBillingAddress(input: $createAddressInput) {
        ... on Order {
          id
          billingAddress{
        fullName
      }
        }
        ... on ErrorResult {
          message
          errorCode
        }
      }
    }
  `;

export const SET_ORDER_SHIPPING_ADDRESS_MUTATION = gql`
    mutation setOrderShippingAddress($createAddressInput: CreateAddressInput!) {
      setOrderShippingAddress(input: $createAddressInput) {
        ... on Order {
          id
          shippingAddress{
        fullName
      }
        }
        ... on ErrorResult {
          message
          errorCode
        }
      }
    }
  `;

export const ADD_COUPON_TO_ORDER_MUTATION = gql`
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

export const REMOVE_COUPON_FROM_ORDER_MUTATION = gql`
    mutation removeCouponCodeFromOrder($couponCode: String!) {
      removeCouponCode(couponCode: $couponCode) {
        __typename
        ... on Order {
          id
        }
      }
    }
  `;

export const GET_ELIGIBLE_PAYMENT_METHODS = gql`
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

export const TRANSITION_ORDER_STATE_MUTATION = gql`
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

export const GENERATE_RAZORPAY_ORDER_ID = gql`
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

export const ADD_PAYMENT_TO_ORDER_MUTATION = gql`
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


export const GET_ORDER_DETAILS_BY_CODE = gql`
query orderByCode($orderCode: String!) {
        orderByCode(code: $orderCode){
          __typename
          id
          code
          lines {
            featuredAsset{
              preview
            }
            productVariant{
              sku
              name
            }
            quantity
            unitPriceWithTax
            linePriceWithTax
          }
          shippingAddress{
            fullName
            streetLine1
            countryCode
            province
            city
            phoneNumber
          }
          shippingWithTax
          shippingLines {
            shippingMethod {
              code
            }
          }
          subTotalWithTax
          discounts {
            amountWithTax
          }
          totalWithTax
        }
      }
`
