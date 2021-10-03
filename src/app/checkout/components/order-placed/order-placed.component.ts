import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'gaushadhi-order-placed',
  templateUrl: './order-placed.component.html',
  styleUrls: ['./order-placed.component.scss'],
})
export class OrderPlacedComponent implements OnInit {
  orderId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.queryParams.order_id;
  }
}
