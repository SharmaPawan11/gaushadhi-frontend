import { Component } from '@angular/core';
import { OrderService } from './core/providers/order.service';
import {Router, Scroll} from "@angular/router";
import {ViewportScroller} from "@angular/common";
import {filter} from "rxjs/operators";

@Component({
  selector: 'gaushadhi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'gaushadhi-frontend';

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
  }
}
