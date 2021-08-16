import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, switchMap, take, takeUntil} from "rxjs/operators";
import {of, Subject} from "rxjs";
import {OrderService} from "../../../core/providers/order.service";
import {RazorpayService} from "../../providers/razorpay.service";
import {CheckoutService} from "../../providers/checkout.service";

@Component({
  selector: 'gaushadhi-checkout-shell',
  templateUrl: './checkout-shell.component.html',
  styleUrls: ['./checkout-shell.component.scss']
})
export class CheckoutShellComponent implements OnInit {
  @ViewChild("scrollPoint",  { read: ElementRef }) scrollPoint!: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  ctaRouteMap: any = {
    'shipping-info': 'Proceed To Payment',
    'summary': 'Pay Now'
  }
  currentRoute!: string;
  currentStage: string = 'Shipping Info';
  customerDetails: any;
  orderDetails: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private razorpayService: RazorpayService,
    private checkoutService: CheckoutService
  ) {
    this.router.events
      .pipe(filter((ev) => ev instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url.split('/')[2];
          switch (this.currentRoute) {
            case 'shipping-info':
              this.currentStage = 'Shipping Info';
              break;
            case 'summary':
              this.currentStage = 'Order Summary';
              break;
            case 'order-placed':
              this.currentStage = 'Order Placed';
              break;
          }
        }
      });
  }

  ngOnInit(): void {
    this.customerDetails = {
      contact: localStorage.getItem('customerPhNo') || undefined,
      name: localStorage.getItem('customerName'),
      email: localStorage.getItem('customerEmail'),
    };

    this.checkoutService.orderData$.pipe(takeUntil(this.destroy$))
      .subscribe((orderDetails) => {
        this.orderDetails = orderDetails;
      })
  }

  scrollToProductDetails() {
    this.scrollPoint.nativeElement.scrollIntoView({
      behavior:"smooth"
    })
  }

  async nextCheckoutStep() {
    switch (this.currentRoute) {
      case 'shipping-info':
        this.router.navigateByUrl('/checkout/summary');
        break;
      case 'summary':
        await this.onPayNow()
        this.router.navigateByUrl('/checkout/order-placed');
    }
  }

  async onPayNow() {
      if (!await this.razorpayService.loadRazorpayScript()) {
        console.error('Unable to load razorpay script');
        return
      }
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
