import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShippingService } from '../../providers/shipping.service';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'gaushadhi-select-shipment',
  templateUrl: './select-shipment.component.html',
  styleUrls: ['./select-shipment.component.scss'],
})
export class SelectShipmentComponent implements OnInit, OnDestroy {
  // ONLY FOR TS FILE
  eligibleShipmentMethods: Array<any> = [];
  selectedShipment = new FormControl('', [Validators.required]);
  selectShipmentSubscription!: Subscription;
  constructor(
    private route: ActivatedRoute,
    private shippingService: ShippingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eligibleShipmentMethods = JSON.parse(
      JSON.stringify(this.route.snapshot.data['eligibleShipmentMethods'])
    );
  }

  ngOnDestroy() {
    this.selectShipmentSubscription.unsubscribe();
  }

  onNext() {
    this.selectShipmentSubscription = this.shippingService
      .setOrderShippingMethod(this.selectedShipment.value.toString())
      .subscribe((res) => {
        switch (res.__typename) {
          case 'OrderModificationError':
          case 'NoActiveOrderError':
          case 'IneligibleShippingMethodError':
            console.log('Error While setting shipping method');
            console.log(res.errorCode, res.message);
            break;
          case 'Order':
            this.router.navigate(['..', 'summary'], {
              relativeTo: this.route,
            });
        }
      });
  }
}
