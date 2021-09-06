import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { OrderService } from '../../../core/providers/order.service';
import { RazorpayService } from '../../providers/razorpay.service';
import { CheckoutService } from '../../providers/checkout.service';

@Component({
  selector: 'gaushadhi-checkout-shell',
  templateUrl: './checkout-shell.component.html',
  styleUrls: ['./checkout-shell.component.scss'],
})
export class CheckoutShellComponent implements OnInit {
  @ViewChild('scrollPoint', { read: ElementRef }) scrollPoint!: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  ctaRouteMap: any = {
    'shipping-info': 'Proceed To Payment',
    summary: 'Pay Now',
  };
  currentRoute!: string;
  currentStage: string = 'Shipping Info';
  customerDetails: any;
  orderDetails: any;
  nextButtonStatus: 'enabled' | 'disabled' = 'disabled';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    public razorpayService: RazorpayService,
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
    this.orderService.currentOrderDetails$.pipe(takeUntil(this.destroy$)).
    subscribe((res) => {
      this.orderDetails = res;
    });

    this.checkoutService.nextButtonStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status: 'disabled' | 'enabled') => {
        this.nextButtonStatus = status;
      });
  }

  scrollToProductDetails() {
    this.scrollPoint.nativeElement.scrollIntoView({
      behavior: 'smooth',
    });
  }

  nextCheckoutStep() {
    this.checkoutService.proceedToNextStep();
  }
}
