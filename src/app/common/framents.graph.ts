import { gql } from 'apollo-angular';

export const ORDER_FRAGMENT = gql`
  fragment Order on Order {
    id
    createdAt
    updatedAt
    orderPlacedAt
    code
    state
    active
    shippingAddress @include(if: $includeOrderAddress) {
      ...OrderAddress
    }
    billingAddress @include(if: $includeOrderAddress) {
      ...OrderAddress
    }
    lines {
      id
      createdAt
      updatedAt
      productVariant {
        id
        # product: [Product!]
        productId
        createdAt
        updatedAt
        languageCode
        sku
        name
        featuredAsset {
          ...Asset
        }
        assets {
          ...Asset
        }
        price
        currencyCode
        priceWithTax
        stockLevel
        taxRateApplied {
          ...TaxRate
        }
        taxCategory {
          id
          createdAt
          updatedAt
          name
          isDefault
        }
        facetValues {
          ...FacetValue
        }
        translations {
          id
          createdAt
          updatedAt
          languageCode
          name
        }
      }
      featuredAsset {
        ...Asset
      }
      unitPrice
      unitPriceWithTax
      unitPriceChangeSinceAdded
      unitPriceWithTaxChangeSinceAdded
      discountedUnitPrice
      discountedUnitPriceWithTax
      proratedUnitPrice
      proratedUnitPriceWithTax
      quantity
      items {
        ...OrderItem
      }
      taxRate
      linePrice
      linePriceWithTax
      discountedLinePrice
      discountedLinePriceWithTax
      proratedLinePrice
      proratedLinePriceWithTax
      lineTax
      discounts {
        ...Discount
      }
      taxLines {
        ...Taxline
      }
    }
    surcharges @include(if: $includeSurcharges) {
      id
      createdAt
      updatedAt
      description
      sku
      taxLines {
        description
        taxRate
      }
      price
      priceWithTax
      taxRate
    }
    discounts @include(if: $includeDiscounts) {
      adjustmentSource
      type
      description
      amount
      amountWithTax
    }
    couponCodes
    promotions @include(if: $includePromotions) {
      id
      createdAt
      updatedAt
      startsAt
      endsAt
      couponCode
      perCustomerUsageLimit
      name
      enabled
    }
    payments @include(if: $includePayments) {
      id
      createdAt
      updatedAt
      method
      amount
      state
      transactionId
      errorMessage
      refunds {
        id
        createdAt
        updatedAt
        items
        shipping
        adjustment
        total
        method
        state
        transactionId
        reason
        orderItems {
          ...OrderItem
        }
        paymentId
        metadata
      }
      metadata
    }
    fulfillments @include(if: $includeFulfillments) {
      ...Fulfillment
    }
    totalQuantity
    subTotal
    subTotalWithTax
    currencyCode
    shippingLines @include(if: $includeShippings) {
      shippingMethod {
        id
        createdAt
        updatedAt
        code
        name
        description
        fulfillmentHandlerCode
      }
      price
      priceWithTax
      discountedPrice
      discountedPriceWithTax
      discounts {
        ...Discount
      }
    }
    shipping
    shippingWithTax
    total
    totalWithTax
    taxSummary @include(if: $includeTaxSummary) {
      description
      taxRate
      taxBase
      taxTotal
    }
    history @include(if: $includeHistory) {
      totalItems
      items {
        id
        createdAt
        updatedAt
        type
        data
      }
    }
    customFields {
      razorpay_order_id
    }
  }
`;

export const ADDRESS_FRAGMENT = gql`
  fragment Address on Address {
    id
    fullName
    company
    streetLine1
    streetLine2
    city
    province
    postalCode
    country {
      id
      code
      name
    }
    phoneNumber
    defaultShippingAddress
    defaultBillingAddress
    createdAt
    updatedAt
  }
`;

export const ERROR_RESULT_FRAGMENT = gql`
  fragment ErrorResult on ErrorResult {
    errorCode
    message
  }
`;

export const SUCCESS_FRAGMENT = gql`
  fragment Success on Success {
    success
  }
`;

export const ASSET_FRAGMENT = gql`
  fragment Asset on Asset {
    id
    width
    height
    name
    preview
    source
    mimeType
    fileSize
    type
    preview
    createdAt
    updatedAt
    focalPoint {
      x
      y
    }
  }
`;

export const TAX_RATE_FRAGMENT = gql`
  fragment TaxRate on TaxRate {
    id
    createdAt
    updatedAt
    name
    enabled
    value
    category {
      id
      createdAt
      updatedAt
      name
      isDefault
    }
    zone {
      id
    }
  }
`;

export const FACET_VALUE_FRAGMENT = gql`
  fragment FacetValue on FacetValue {
    id
    createdAt
    updatedAt
    languageCode
    facet {
      id
      createdAt
      updatedAt
      languageCode
      name
      code
    }
    name
    code
    customFields
  }
`;

export const DISCOUNT_FRAGMENT = gql`
  fragment Discount on Discount {
    adjustmentSource
    type
    description
    amount
    amountWithTax
  }
`;

export const TAX_LINE_FRAGMENT = gql`
  fragment Taxline on TaxLine {
    description
    taxRate
  }
`;

export const ORDER_ITEM_FRAGMENT = gql`
  fragment OrderItem on OrderItem {
    id
    createdAt
    updatedAt
    cancelled
    unitPrice
    unitPriceWithTax
    discountedUnitPrice
    discountedUnitPriceWithTax
    proratedUnitPrice
    proratedUnitPriceWithTax
    unitTax
    taxRate
    adjustments {
      adjustmentSource
      type
      description
      amount
    }
    taxLines {
      ...Taxline
    }
    fulfillment {
      ...Fulfillment
    }
    refundId
  }
`;

export const FULFILLMENT_FRAGMENT = gql`
  fragment Fulfillment on Fulfillment {
    id
    createdAt
    updatedAt
    state
    method
    trackingCode
    customFields
  }
`;

export const ORDER_ADDRESS_FRAGMENT = gql`
  fragment OrderAddress on OrderAddress {
    fullName
    company
    streetLine1
    streetLine2
    city
    province
    postalCode
    country
    countryCode
    phoneNumber
  }
`;

export const PRODUCT_VARIANT_FRAGMENT = gql`
  fragment ProductVariant on ProductVariant {
    id
    # product: [Product!]
    productId
    createdAt
    updatedAt
    languageCode
    sku
    name
    price
    currencyCode
    priceWithTax
    stockLevel
    taxRateApplied {
      ...TaxRate
    }
    taxCategory {
      id
      createdAt
      updatedAt
      name
      isDefault
    }
    facetValues {
      ...FacetValue
    }
    translations {
      id
      createdAt
      updatedAt
      languageCode
      name
    }
    customFields {
      strikethrough_price
    }
  }
`;

// featuredAsset {
//   id
//   preview
// }
// assets {
//   ...Asset
// }

export const CART_FRAGMENT = gql`
  fragment Cart on Order {
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
`;
