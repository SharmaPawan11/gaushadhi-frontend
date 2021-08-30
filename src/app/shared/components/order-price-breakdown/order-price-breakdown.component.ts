import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import {OrderService} from "../../../core/providers/order.service";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'gaushadhi-order-price-breakdown',
  templateUrl: './order-price-breakdown.component.html',
  styleUrls: ['./order-price-breakdown.component.scss'],
})
export class OrderPriceBreakdownComponent implements OnInit, OnDestroy {
  orderDetails$!: Observable<any>;
  orderDetailsSubscription!: Subscription;
  orderDetails: any;
  totalDiscount: number = 0;
  totalUnitPrice: number = 0;

  constructor(
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderDetails$ = this.orderService.currentOrderDetails$;
    this.orderDetailsSubscription = this.orderDetails$.subscribe((res) => {
      this.orderDetails = res;
      this.totalDiscount = 0;
      this.orderDetails?.discounts.forEach((discount: any) => {
        this.totalDiscount += discount.amountWithTax;
      })
      this.totalDiscount *= -1;

      this.totalUnitPrice = 0;
      this.orderDetails?.lines.forEach((line: any) => {
        this.totalUnitPrice += line.linePriceWithTax;
      })
    });
  }

  ngOnDestroy() {
    this.orderDetailsSubscription.unsubscribe();
  }
}
