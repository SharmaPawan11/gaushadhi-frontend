import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from '../../../core/providers/order.service';
import { RazorpayService } from '../../providers/razorpay.service';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { CheckoutService } from '../../providers/checkout.service';

@Component({
  selector: 'gaushadhi-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.scss'],
})
export class OrderReviewComponent implements OnInit, OnDestroy {
  //TODO: Customer data storage API needs brainstorming
  //TODO: GodLike Error Handling
  //TODO: Coupon Codes
  destroy$: Subject<boolean> = new Subject<boolean>();
  customerDetails: any;
  orderDetails: any;
  eligiblePaymentMethods: Array<any> = [];
  couponCodeInput = new FormControl('', [Validators.required]);
  appliedCoupons: Set<string> = new Set();

  constructor(
    private orderService: OrderService,
    private razorpayService: RazorpayService,
    private route: ActivatedRoute,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    this.orderDetails = JSON.parse(
      JSON.stringify(this.route.snapshot.data['currentOrderReview'])
    );
    this.checkoutService.pushNewOrderData(this.orderDetails);

    this.eligiblePaymentMethods = JSON.parse(
      JSON.stringify(this.route.snapshot.data['eligiblePaymentMethods'])
    );
    this.customerDetails = {
      contact: localStorage.getItem('customerPhNo') || undefined,
      name: localStorage.getItem('customerName'),
      email: localStorage.getItem('customerEmail'),
    };
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onAddCoupon() {
    this.orderService
      .addCouponToOrder(this.couponCodeInput.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        switch (res.__typename) {
          case 'CouponCodeExpiredError':
          case 'CouponCodeInvalidError':
          case 'CouponCodeLimitError':
            console.log(res);
            break;
          case 'Order':
            this.appliedCoupons.add(this.couponCodeInput.value);
            console.log(res);
        }
      });
  }

  onRemoveCoupon(couponCode: string) {
    this.orderService
      .removeCouponFromOrder(couponCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log(res);
        this.appliedCoupons.delete(couponCode);
      });
  }
}
