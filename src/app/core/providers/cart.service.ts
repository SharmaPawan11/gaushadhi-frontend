import { Injectable } from '@angular/core';
import { RequestorService } from './requestor.service';
import { gql } from 'apollo-angular';
import { AddToCart } from '../../common/vendure-types';
import {map, tap, filter, retry, catchError, take} from 'rxjs/operators';
import { CART_FRAGMENT, ORDER_FRAGMENT } from '../../common/framents.graph';
import { OrderService } from './order.service';
import {
  OnErrorChangeOrderStateThenRetry
} from "../operators/on-error-change-order-state-then-retry.operator";
import {SnackbarService} from "./snackbar.service";
import {SetDefaultShippingOnFirstItemAdd} from "../operators/set-default-shipping-on-first-item-add";
import {EMPTY, of} from "rxjs";
import {UserService} from "./user.service";
import {Router} from "@angular/router";
import {notNullOrNotUndefined} from "../../common/utils/not-null-or-not-undefined";

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
          shippingLines {
            shippingMethod {
              id
            }
          }
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
    private snackbarService: SnackbarService,
    private onErrorChangeStateThenRetry: OnErrorChangeOrderStateThenRetry,
    private userService: UserService,
    private router: Router
  ) {}

  addToCart(productVariantId: string | number, quantity: number) {
    if (!this.userService.isAuthenticated) {
      this.snackbarService.openSnackBar('You must be signed-in in order to add item to cart', 0);
      this.router.navigate(['login']);
      return of(EMPTY);
    }
    //TODO: Handle error cases
    return this.requestor
      .mutate<AddToCart.Mutation>(this.ADD_ITEM_TO_CART_MUTATION, {
        productVariantId,
        quantity,
      })
      .pipe(
        map((res) => res.addItemToOrder),
        this.onErrorChangeStateThenRetry.operator('AddingItems'),
        filter(notNullOrNotUndefined),
        tap((res) => {
          switch (res?.__typename) {
            case 'OrderModificationError':
            case 'OrderLimitError':
            case 'InsufficientStockError':
            case 'NegativeQuantityError':
              this.snackbarService.openSnackBar(res.message, 0);
              break;
          }
        })
      );
  }

  adjustOrderItemQuantity(orderLineId: number | string, quantity: number) {
    console.log(this.userService.isAuthenticated);
    if (!this.userService.isAuthenticated) {
      this.snackbarService.openSnackBar('You must be signed-in in order to change quantity', 0);
      this.router.navigate(['login']);
      return of(EMPTY);
    }

    return this.requestor
      .mutate(this.ADJUST_ORDER_LINE_MUTATION, {
        orderLineId,
        quantity,
      })
      .pipe(
        map((res) => res.adjustOrderLine),
        this.onErrorChangeStateThenRetry.operator('AddingItems'),
        filter(notNullOrNotUndefined),
        tap((res) => {
          if (res?.__typename === 'InsufficientStockError') {
           this.snackbarService.openSnackBar(res.message);
          }
        })

      );
  }

}
