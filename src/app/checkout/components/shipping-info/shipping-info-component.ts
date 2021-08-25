import { Component, OnInit } from '@angular/core';
import { forkJoin, of, Subject, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { OrderService } from '../../../core/providers/order.service';
import { take, takeUntil, tap } from 'rxjs/operators';
import { AddressService } from '../../../core/providers/address.service';
import { AddressFormComponent } from '../../../shared/components/address-form/address-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../core/providers/snackbar.service';

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
  editedIndex: number = -1;
  updatedAddress: any;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private addressService: AddressService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const addresses = this.route.snapshot.data['addresses'];
    this.customerAddresses = addresses
      ? JSON.parse(JSON.stringify(this.route.snapshot.data['addresses']))
      : [];
    this.customerAddresses.forEach((address) => {
      if (address.defaultShippingAddress) {
        this.selectedShippingAddress.setValue(address);
      }
    });

    const shipmentMethods = this.route.snapshot.data['eligibleShipmentMethods'];
    this.eligibleShipmentMethods = shipmentMethods
      ? JSON.parse(JSON.stringify(shipmentMethods))
      : [];
    this.eligibleShipmentMethods.forEach((method) => {
      if (method.code === 'standard-shipping') {
        this.selectedShippingMethod.setValue(method);
      }
    });
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
  onDeleteAddress(addressId: string) {
    this.addressService
      .deleteAddress(addressId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.success) {
          this.customerAddresses = this.customerAddresses.filter((address) => {
            return address.id !== addressId;
          });
          this.snackbarService.openSnackBar('Address deleted successfully');
        }
      });
  }

  onEditAddress(addressId: string) {
    const customerAddress = this.customerAddresses.find((address, idx) => {
      if (address.id === addressId) {
        this.editedIndex = idx;
        return address;
      }
    });

    this.openAddressDialog(customerAddress);
  }

  openAddressDialog(addressData?: any) {
    this.addressService
      .openAddressDialog(AddressFormComponent, addressData)
      .pipe(
        tap((data) => {
          if (!data.dialogReturnValue.newAddress) {
            this.updatedAddress = data.dialogReturnValue.data;
          }
        }),
        switchMap((data) => {
          if (!data.obs) {
            return of(null);
          }
          return data.obs;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res: any) => {
        if (res && res.id) {
          if (res.updatedAt) {
            this.customerAddresses.push(res);
            this.snackbarService.openSnackBar('Address added successfully');
          } else {
            if (this.updatedAddress.countryCode) {
              this.updatedAddress.country = {
                code: this.updatedAddress.countryCode,
              };
              delete this.updatedAddress.countryCode;
            }
            Object.assign(
              this.customerAddresses[this.editedIndex],
              this.updatedAddress
            );
            this.snackbarService.openSnackBar('Address updated successfully');
          }
        }
      });
  }
}
