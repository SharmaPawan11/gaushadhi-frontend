import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShippingService } from '../../providers/shipping.service';

@Component({
  selector: 'gaushadhi-select-shipment',
  templateUrl: './select-shipment.component.html',
  styleUrls: ['./select-shipment.component.scss'],
})
export class SelectShipmentComponent implements OnInit {
  eligibleShipmentMethods: Array<any> = [];
  constructor(
    private route: ActivatedRoute,
    private shippingService: ShippingService
  ) {}

  ngOnInit(): void {
    this.eligibleShipmentMethods = JSON.parse(
      JSON.stringify(this.route.snapshot.data['eligibleShipmentMethods'])
    );
    console.log(this.eligibleShipmentMethods);
  }
}
