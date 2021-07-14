import { Injectable } from '@angular/core';
import { RequestorService } from '../../core/providers/requestor.service';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  GET_ACTIVE_ORDER_QUERY = gql``;

  constructor(private requestor: RequestorService) {}

  getActiveOrder() {}
}
