import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { RequestorService } from '../../core/providers/requestor.service';
import {
  Mutation,
  Query
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
        priceWithTax
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

  getEligibleShippingMethods(): Observable<Query["eligibleShippingMethods"]> {
    return this.requestor
      .query(this.ELIGIBLE_SHIPPING_METHODS)
      .pipe(map((res) => res.eligibleShippingMethods));
  }

  setOrderShippingMethod(shippingMethodId: string | number): Observable<Mutation["setOrderShippingMethod"]> {
    return this.requestor
      .mutate(this.SET_ORDER_SHIPPING_METHOD, {
        shippingMethodId,
      })
      .pipe(map((res) => res.setOrderShippingMethod));
  }
}
