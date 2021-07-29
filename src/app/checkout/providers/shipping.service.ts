import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { RequestorService } from '../../core/providers/requestor.service';
import {
  GetEligibleShippingMethods,
  SetShippingMethod,
} from '../../common/vendure-types';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  ELIGIBLE_SHIPPING_METHODS = gql`
    query eligibleShippingMethods {
      eligibleShippingMethods {
        id
        code
        name
        description
        price
        metadata
      }
    }
  `;

  SET_ORDER_SHIPPING_METHOD = gql`
    mutation setOrderShippingMethod($shippingMethodId: ID!) {
      setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
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

  getEligibleShippingMethods() {
    return this.requestor
      .query<GetEligibleShippingMethods.Query>(this.ELIGIBLE_SHIPPING_METHODS)
      .pipe(map((res) => res.eligibleShippingMethods));
  }

  setOrderShippingMethod(shippingMethodId: string) {
    return this.requestor
      .mutate<SetShippingMethod.Mutation>(this.SET_ORDER_SHIPPING_METHOD, {
        shippingMethodId,
      })
      .pipe(map((res) => res.setOrderShippingMethod));
  }
}
