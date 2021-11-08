import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { Order} from "../../../common/vendure-types";

@Component({
  selector: 'gaushadhi-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {

  //TODO: Add filters

  orders!: Array<Order>;
  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.orders = this.route.snapshot.data['ordersList'].orders.items
    // console.log(this.orders);
  }

  identify(index: number, orderLine: any): number {
    return orderLine.id;
  }
}
