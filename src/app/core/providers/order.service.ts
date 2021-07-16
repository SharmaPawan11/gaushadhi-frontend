import { Injectable } from '@angular/core';
import { RequestorService } from './requestor.service';
import { gql } from 'apollo-angular';
import { SetShippingAddress } from '../../common/vendure-types';
import SetOrderShippingAddress = SetShippingAddress.SetOrderShippingAddress;
import { map } from 'rxjs/operators';

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
}
