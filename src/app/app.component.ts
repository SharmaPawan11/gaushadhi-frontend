import { Component } from '@angular/core';
import { OrderService } from './core/providers/order.service';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, Scroll} from "@angular/router";
import {ViewportScroller} from "@angular/common";
import {filter} from "rxjs/operators";

@Component({
  selector: 'gaushadhi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'gaushadhi-frontend';
  loading = false;

  constructor(private orderService: OrderService,
              private router: Router,
              private viewportScroller: ViewportScroller) {
    this.orderService.refreshOrderDetails('Order');

    router.events.pipe(
      filter((e: any): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      const splittedUrl = router.url.split('/');
      const lastUrlSegment = splittedUrl[splittedUrl.length - 1];
      if (!lastUrlSegment.includes('products')) {
        viewportScroller.scrollToPosition([0, 0]);
      }
    });

    router.events.subscribe((routerEvent: any) => {
      if (routerEvent instanceof NavigationStart) {
        this.loading = true
      }

      if (routerEvent instanceof NavigationEnd ||
          routerEvent instanceof NavigationCancel ||
          routerEvent instanceof NavigationError) {
        this.loading = false;
      }
    })

  }
}
