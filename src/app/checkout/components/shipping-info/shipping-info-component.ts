import { Component, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { OrderService } from '../../../core/providers/order.service';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gaushadhi-select-address',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.scss'],
})
export class ShippingInfoComponent implements OnInit {
  // TODO: Add address Implementation

  destroy$: Subject<boolean> = new Subject<boolean>();
  customerAddresses: Array<any> = [];
  eligibleShipmentMethods: Array<any> = [];
  selectedShippingAddress = new FormControl('', [Validators.required]);
  selectedShippingMethod = new FormControl('', [Validators.required]);

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const addresses = this.route.snapshot.data['addresses']
    this.customerAddresses = addresses ? JSON.parse(
      JSON.stringify(this.route.snapshot.data['addresses'])
      ) : [];
    this.customerAddresses.forEach((address) => {
      if (address.defaultShippingAddress) {
        this.selectedShippingAddress.setValue(address);
      }
    })

    const shipmentMethods = this.route.snapshot.data['eligibleShipmentMethods'];
    this.eligibleShipmentMethods = shipmentMethods ? JSON.parse(
      JSON.stringify(shipmentMethods)
    ) : []
    this.eligibleShipmentMethods.forEach((method) => {
      if (method.code === 'standard-shipping') {
        this.selectedShippingMethod.setValue(method)
      }
    })
  }

  onNext(): void {
    let shippingAddress = this.selectedShippingAddress.value;
    shippingAddress = {
      fullName: shippingAddress.fullName,
      company: shippingAddress.company,
      streetLine1: shippingAddress.streetLine1,
      streetLine2: shippingAddress.streetLine2,
      city: shippingAddress.city,
      province: shippingAddress.province,
      postalCode: shippingAddress.postalCode,
      countryCode: shippingAddress.country.code,
      phoneNumber: shippingAddress.phoneNumber,
    };

    const setOrderShippingAddress$ = this.orderService
      .setOrderShippingAddress(shippingAddress)
      .pipe(take(1));
    const setOrderBillingAddress$ = this.orderService
      .setOrderBillingAddress(shippingAddress)
      .pipe(take(1));

    forkJoin([setOrderShippingAddress$, setOrderBillingAddress$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([shippingAddressRes, billingAddressRes]) => {
        if (
          shippingAddressRes.__typename === 'Order' &&
          billingAddressRes.__typename === 'Order'
        ) {
          console.log('SET SUCCESSFUL');
          this.router.navigate(['..', 'select-shipment'], {
            relativeTo: this.route,
          });
        }
      });
  }
}
