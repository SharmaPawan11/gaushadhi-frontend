import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import { OrderService } from '../../../core/providers/order.service';
import { RazorpayService } from '../../providers/razorpay.service';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { CheckoutService } from '../../providers/checkout.service';
import {
  UpdateOrderDetailsGlobally
} from "../../../core/operators/update-order-details-globally.operator";
import {UserProfile, UserService} from "../../../core/providers/user.service";

@Component({
  selector: 'gaushadhi-order-review',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  //TODO: Customer data storage API needs brainstorming
  //TODO: GodLike Error Handling
  //TODO: Coupon Codes
  destroy$: Subject<boolean> = new Subject<boolean>();
  customerDetails: UserProfile = {
    customerName: '',
    customerEmail: '',
    customerPhNo: ''
  };
  orderDetails: any;
  couponCodeInput = new FormControl('', [Validators.required]);
  appliedCoupons: Set<string> = new Set();
  razorpayFlowActive = false;

  constructor(
    private orderService: OrderService,
    private razorpayService: RazorpayService,
    private checkoutService: CheckoutService,
    private userService: UserService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private router: Router,
    private zone: NgZone,
    private updateOrderDetailsGlobally: UpdateOrderDetailsGlobally,
  ) {}

  ngOnInit(): void {
    this.checkoutService.enableNextButton();
    this.orderService.refreshOrderDetails('Order');

    this.orderService.currentOrderDetails$.pipe(takeUntil(this.destroy$)).
    subscribe((res) => {
      this.orderDetails = res;
    });

    this.userService.userProfile$.pipe(takeUntil(this.destroy$))
      .subscribe((userProfileData) => {
        this.customerDetails = userProfileData;
    })

    this.checkoutService.onNext$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onNext();
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onNext() {
    this.onPayNow();
  }

  async onPayNow() {
    this.razorpayFlowActive = true;
    if (!(await this.razorpayService.loadRazorpayScript())) {
      console.error('Unable to load razorpay script');
      return;
    }
    this.orderService.generateRazorpayOrderId(this.orderDetails.id).pipe(
      this.updateOrderDetailsGlobally.operator(),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.onRazorpayIdGeneration(res);
      });
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
      this.razorpayFlowActive = false;
      this.cd.detectChanges();
    }
  }

  openRazorpayPopup(razorpayOrderId: string) {
    try {
      const Razorpay = this.razorpayService.Razorpay;
      this.razorpayService.razorpayOrderId = razorpayOrderId;
      this.razorpayService.razorpayPrefill = {
        contact: this.customerDetails.customerPhNo,
        email: this.customerDetails.customerEmail,
        name: this.customerDetails.customerName,
      };
      this.razorpayService.razorpaySuccessCallback =
        this.onRazorpayPaymentSuccess.bind(this);
      this.razorpayService.razorpayManualCloseCallback =
        this.onRazorpayManualClose.bind(this);
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
    this.razorpayFlowActive = false;
    this.cd.detectChanges();
    this.orderService
      .addRazorpayPaymentToOrder(metadata)
      .pipe(
        takeUntil(this.destroy$))
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
            this.orderService.refreshOrderDetails();
            this.zone.run(() => {
              this.router.navigate(['..', 'order-placed'], {
                relativeTo: this.route,
                queryParams: {
                  order_id: this.orderDetails.code
                }
              });
            })
        }
      });
  }

  onRazorpayManualClose() {
    if (confirm('Are you sure, you want to close the form?')) {
      console.log('Checkout form closed by the user');
      this.razorpayFlowActive = false;

      /**
       * For some reason, angular is not picking up changes when I set
       * this.razorpayFlowActive to false. Even markForCheck is not working
       * NO FUCKING IDEA WHY.
       * So, Using detectChanges for now.
       * **/
      this.cd.detectChanges();
    } else {
      console.log('Complete the Payment');
    }
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

  identify(index: number, orderLine: any): number {
    return orderLine.id;
  }
}
