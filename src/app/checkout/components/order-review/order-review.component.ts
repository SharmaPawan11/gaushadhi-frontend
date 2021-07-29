import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from '../../../core/providers/order.service';
import { RazorpayService } from '../../providers/razorpay.service';
import {switchMap, take, takeUntil} from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { Order } from '../../../common/vendure-types';
import { ActivatedRoute } from '@angular/router';
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'gaushadhi-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.scss'],
})
export class OrderReviewComponent implements OnInit, OnDestroy {
  //TODO: Customer data storage API needs brainstorming
  //TODO: GodLike Error Handeling
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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.orderDetails = JSON.parse(
      JSON.stringify(this.route.snapshot.data['currentOrderReview'])
    );
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
    this.orderService.addCouponToOrder(this.couponCodeInput.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        switch (res.__typename) {
          case "CouponCodeExpiredError":
          case "CouponCodeInvalidError":
          case "CouponCodeLimitError":
            console.log(res)
            break;
          case "Order":
            this.appliedCoupons.add(this.couponCodeInput.value)
            console.log(res)
        }
    })
  }

  onRemoveCoupon(couponCode: string) {
    this.orderService.removeCouponFromOrder(couponCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
      console.log(res)
        this.appliedCoupons.delete(couponCode)
    })
  }

  onPayNow(paymentMethod: any) {
    if (paymentMethod.code === 'razorpay') {
      if (this.orderDetails.state !== 'ArrangingPayment') {
        this.orderService
          .transitionOrderState('ArrangingPayment')
          .pipe(
            switchMap((res) => {
              if (res?.__typename === 'Order') {
                return this.orderService.generateRazorpayOrderId(res.id);
              } else if (res?.__typename === 'OrderStateTransitionError') {
                console.log(res.errorCode, res.message);
                return of('TRANSITION ERROR');
              }
              return of(null);
            }),
            takeUntil(this.destroy$)
          )
          .subscribe((res) => {
            this.onRazorpayIdGeneration(res);
          });
      } else {
        this.orderService
          .generateRazorpayOrderId(this.orderDetails.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            this.onRazorpayIdGeneration(res);
          });
      }
    }
  }

  onRazorpayIdGeneration(res: any) {
    if (res.__typename === 'RazorpayOrderIdSuccess') {
      const razorpayOrderId = res.razorpayOrderId;
      this.openRazorpayPopup(razorpayOrderId);
    } else {
      console.log(
        'Some error occurred while generating Razorpay orderId',
        res.message,
        res.errorCode
      );
    }
  }

  openRazorpayPopup(razorpayOrderId: string) {
    try {
      const Razorpay = this.razorpayService.Razorpay;
      this.razorpayService.razorpayOrderId = razorpayOrderId;
      this.razorpayService.razorpayPrefill = {
        contact: this.customerDetails.contact,
        email: this.customerDetails.email,
        name: this.customerDetails.name,
      };
      this.razorpayService.razorpaySuccessCallback =
        this.onRazorpayPaymentSuccess.bind(this);
      const rzp = new Razorpay(this.razorpayService.razorpayOptions);
      rzp.on('payment.failed', (response: any) => {
        console.log(response);
      });
      rzp.open();
    } catch (e) {
      console.log(e);
    }
  }

  onRazorpayPaymentSuccess(metadata: Object) {
    this.orderService
      .addRazorpayPaymentToOrder(metadata)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        switch (res.__typename) {
          case 'PaymentFailedError':
          case 'PaymentDeclinedError':
          case 'IneligiblePaymentMethodError':
          case 'OrderPaymentStateError':
            console.log(res.errorCode, res.message);
            break;
          case 'Order':
            console.log('PAYMENT SUCCESSFUL');
            console.log(res);
        }
      });
  }
}
