import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/providers/order.service';
import { Observable, Subject } from 'rxjs';
import { CartService } from '../../../core/providers/cart.service';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  updateOrderDetailsGlobally
} from "../../../common/operators/update-order-details-globally.operator";

@Component({
  selector: 'gaushadhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('scrollPoint', { read: ElementRef }) scrollPoint!: any;
  quantity = 1;
  orderDetails = [];
  orderDetails$!: Observable<any>;
  quantityChange = new Subject<{
    newQuantity: number;
    orderLineId: number | string;
  }>();
  disableCartMutation = false;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.orderDetails$ = this.orderService.currentOrderDetails$;
    this.orderDetails$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.disableCartMutation = false;
    });

    this.quantityChange
      .pipe(
        tap(() => this.disableCartMutation = true),
        switchMap((res) => {
          return this.cartService.adjustOrderItemQuantity(
            res.orderLineId,
            res.newQuantity
          );
        }),
        updateOrderDetailsGlobally(this.orderService.refreshOrderDetails.bind(this.orderService)),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  scrollToProductDetails() {
    this.scrollPoint.nativeElement.scrollIntoView({
      behavior: 'smooth',
    });
  }

  identify(index: number, orderLine: any): number {
    return orderLine.id;
  }

  increaseQuantity(line: any) {
    this.quantityChange.next({'orderLineId': line.id, 'newQuantity': line.quantity + 1});
  }

  decreaseQuantity(line: any) {
    this.quantityChange.next({'orderLineId': line.id, 'newQuantity': line.quantity - 1});
  }

}
