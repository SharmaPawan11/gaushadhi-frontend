import { Component, OnInit } from '@angular/core';
import { OrderService } from './core/providers/order.service';

@Component({
  selector: 'gaushadhi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'gaushadhi-frontend';

  constructor(private orderService: OrderService) {
    this.orderService.refreshOrderDetails('Order');
  }
}
