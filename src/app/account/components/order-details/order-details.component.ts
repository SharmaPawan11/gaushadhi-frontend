import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Order} from "../../../common/vendure-types";

@Component({
  selector: 'gaushadhi-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  orderDetails!: Order;
  totalDiscount: number = 0;
  totalUnitPrice: number = 0;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.orderDetails = this.route.snapshot['data'].orderDetails;

    this.totalDiscount = 0;
    this.orderDetails.discounts.forEach((discount) => {
      this.totalDiscount += discount.amountWithTax;
    });
    this.totalDiscount *= -1;

    this.totalUnitPrice = 0;
    this.orderDetails?.lines.forEach((line: any) => {
      this.totalUnitPrice += line.linePriceWithTax;
    })
  }
}
