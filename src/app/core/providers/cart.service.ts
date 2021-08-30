import { Injectable } from '@angular/core';
import { RequestorService } from './requestor.service';
import { gql } from 'apollo-angular';
import { AddToCart } from '../../common/vendure-types';
import {map, tap, filter, retry, catchError, take} from 'rxjs/operators';
import { CART_FRAGMENT, ORDER_FRAGMENT } from '../../common/framents.graph';
import { OrderService } from './order.service';
import { notNullOrNotUndefined } from '../../common/utils/not-null-or-not-undefined';
import {firstValueFrom, of, switchMap, throwError} from "rxjs";
import {
  changeOrderStateOnErrorThenRetry
} from "../../common/operators/change-order-state-on-error-then-retry.operator";
import {SnackbarService} from "./snackbar.service";

@Injectable({
  providedIn: 'root',
})
export class CartService {
  ADD_ITEM_TO_CART_MUTATION = gql`
    mutation addItemToOrder($productVariantId: ID!, $quantity: Int!) {
      addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
        __typename
        ... on Order {
          id
        }
        ... on ErrorResult {
          errorCode
          message
        }
        ... on InsufficientStockError {
          errorCode
          message
          quantityAvailable
          order {
            ...Cart
          }
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  ADJUST_ORDER_LINE_MUTATION = gql`
    mutation adjustOrderLine($orderLineId: ID!, $quantity: Int!) {
      adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
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

  constructor(
    private requestor: RequestorService,
    private orderService: OrderService,
    private snackbarService: SnackbarService
  ) {}

  addToCart(productVariantId: string | number, quantity: number) {
    //TODO: Handle error cases
    return this.requestor
      .mutate<AddToCart.Mutation>(this.ADD_ITEM_TO_CART_MUTATION, {
        productVariantId,
        quantity,
      })
      .pipe(
        map((res) => res.addItemToOrder),
        changeOrderStateOnErrorThenRetry(this.orderService.transitionOrderState('AddingItems')),
        tap((res) => {
          switch (res?.__typename) {
            case 'OrderModificationError':
            case 'OrderLimitError':
            case 'InsufficientStockError':
            case 'NegativeQuantityError':
              this.snackbarService.openSnackBar(res.message, 'Close', 0);
              break;
          }
        })
      );
  }

  adjustOrderItemQuantity(orderLineId: number | string, quantity: number) {
    return this.requestor
      .mutate(this.ADJUST_ORDER_LINE_MUTATION, {
        orderLineId,
        quantity,
      })
      .pipe(
        map((res) => res.adjustOrderLine),
        changeOrderStateOnErrorThenRetry(this.orderService.transitionOrderState('AddingItems')),
        tap((res) => {
          if (res?.__typename === 'InsufficientStockError') {
           this.snackbarService.openSnackBar(res.message);
          }
        })

      );
  }
}
