import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { RequestorService } from '../../core/providers/requestor.service';
import { GetEligibleShippingMethods } from '../../common/vendure-types';
import { map } from 'rxjs/operators';

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

  SET_ORDER_SHIPPING_METHDO = gql``;

  constructor(private requestor: RequestorService) {}

  getEligibleShippingMethods() {
    return this.requestor
      .query<GetEligibleShippingMethods.Query>(this.ELIGIBLE_SHIPPING_METHODS)
      .pipe(map((res) => res.eligibleShippingMethods));
  }
}
