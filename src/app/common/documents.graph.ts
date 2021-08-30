import { gql } from 'apollo-angular';
import {
  ADDRESS_FRAGMENT,
  ASSET_FRAGMENT,
  DISCOUNT_FRAGMENT,
  FACET_VALUE_FRAGMENT,
  FULFILLMENT_FRAGMENT,
  ORDER_ADDRESS_FRAGMENT,
  ORDER_FRAGMENT,
  ORDER_ITEM_FRAGMENT,
  TAX_LINE_FRAGMENT,
  TAX_RATE_FRAGMENT,
} from './framents.graph';

export const GET_CUSTOMER_ADDRESSES = gql`
  query GetCustomerAddresses {
    activeCustomer {
      addresses {
        ...Address
      }
    }
  }
  ${ADDRESS_FRAGMENT}
`;

export const GET_ACTIVE_CUSTOMER = gql`
  query GetActiveCustomer(
    $includeAddress: Boolean!
    $includeProfile: Boolean!
    $includeOrder: Boolean!
    $orderOptions: OrderListOptions
  ) {
    activeCustomer {
      id @include(if: $includeProfile)
      title @include(if: $includeProfile)
      firstName @include(if: $includeProfile)
      lastName @include(if: $includeProfile)
      emailAddress @include(if: $includeProfile)
      phoneNumber @include(if: $includeProfile)
      addresses @include(if: $includeAddress) {
        ...Address
      }
      orders(options: $orderOptions) @include(if: $includeOrder) {
        totalItems
        items {
          id
          code
          state
          active
          lines {
            id
            unitPrice
            unitPriceWithTax
            quantity
            linePriceWithTax
            discountedLinePriceWithTax
            productVariant {
              id
              name
            }
            featuredAsset {
              ...Asset
            }
            discounts {
              amount
              amountWithTax
              description
              adjustmentSource
              type
            }
          }
          totalQuantity
          subTotal
          subTotalWithTax
          total
          totalWithTax
          shipping
          shippingWithTax
          shippingLines {
            priceWithTax
            shippingMethod {
              id
              code
              name
              description
            }
          }
          discounts {
            amount
            amountWithTax
            description
            adjustmentSource
            type
          }
        }
      }
      user {
        id
        lastLogin
      }
    }
  }
  ${ADDRESS_FRAGMENT}
  ${ASSET_FRAGMENT}
`;

export const GET_ACTIVE_ORDER = gql`
  query activeOrder(
    $includeOrderAddress: Boolean!
    $includeSurcharges: Boolean!
    $includeDiscounts: Boolean!
    $includePromotions: Boolean!
    $includePayments: Boolean!
    $includeFulfillments: Boolean!
    $includeShippings: Boolean!
    $includeTaxSummary: Boolean!
    $includeHistory: Boolean!
  ) {
    activeOrder {
      __typename
      ...Order
    }
  }
  ${ORDER_FRAGMENT}
  ${ASSET_FRAGMENT}
  ${FACET_VALUE_FRAGMENT}
  ${DISCOUNT_FRAGMENT}
  ${TAX_LINE_FRAGMENT}
  ${ORDER_ITEM_FRAGMENT}
  ${FULFILLMENT_FRAGMENT}
  ${ORDER_ADDRESS_FRAGMENT}
  ${TAX_RATE_FRAGMENT}
`;
