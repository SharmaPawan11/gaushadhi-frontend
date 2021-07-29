import { Component, OnInit } from '@angular/core';
import { AddressService } from '../../../core/providers/address.service';
import { forkJoin, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { OrderService } from '../../../core/providers/order.service';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gaushadhi-select-address',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.scss'],
})
export class SelectAddressComponent implements OnInit {
  // TODO: Add address Implementation

  destroy$: Subject<boolean> = new Subject<boolean>();
  customerAddresses: Array<any> = [];
  selectedShippingAddress = new FormControl('', [Validators.required]);
  billingAddressSameAsShipping: boolean = true;
  selectedBillingAddress = new FormControl('', [Validators.required]);

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerAddresses = JSON.parse(
      JSON.stringify(this.route.snapshot.data['addresses'])
    );
  }

  get hasAddressesSet() {
    return (
      this.selectedShippingAddress.valid &&
      (this.billingAddressSameAsShipping || this.selectedBillingAddress.valid)
    );
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
    let billingAddress = this.selectedBillingAddress.value;
    if (this.billingAddressSameAsShipping) {
      billingAddress = shippingAddress;
    } else {
      billingAddress = {
        fullName: billingAddress.fullName,
        company: billingAddress.company,
        streetLine1: billingAddress.streetLine1,
        streetLine2: billingAddress.streetLine2,
        city: billingAddress.city,
        province: billingAddress.province,
        postalCode: billingAddress.postalCode,
        countryCode: billingAddress.country.code,
        phoneNumber: billingAddress.phoneNumber,
      };
    }

    const setOrderShippingAddress$ = this.orderService
      .setOrderShippingAddress(shippingAddress)
      .pipe(take(1));
    const setOrderBillingAddress$ = this.orderService
      .setOrderBillingAddress(billingAddress)
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
