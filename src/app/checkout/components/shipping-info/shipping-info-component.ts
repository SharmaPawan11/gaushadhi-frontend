import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, of, Subject, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { OrderService } from '../../../core/providers/order.service';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { AddressService } from '../../../core/providers/address.service';
import { AddressFormComponent } from '../../../custom/components/address-form/address-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../core/providers/snackbar.service';
import { ShippingService } from '../../providers/shipping.service';
import { CheckoutService } from '../../providers/checkout.service';
import {
  UpdateOrderDetailsGlobally
} from "../../../core/operators/update-order-details-globally.operator";

@Component({
  selector: 'gaushadhi-select-address',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.scss'],
})
export class ShippingInfoComponent implements OnInit, OnDestroy {
  // TODO: Add address Implementation

  destroy$: Subject<boolean> = new Subject<boolean>();
  customerAddresses: Array<any> = [];
  eligibleShipmentMethods: Array<any> = [];
  shippingInfoForm = this.fb.group({
    shippingAddress: ['', [Validators.required]],
    shippingMethod: ['', [Validators.required]],
  });
  currentFormStatus: string = 'INVALID';
  editedIndex: number = -1;
  updatedAddress: any;

  get shippingAddress() {
    return this.shippingInfoForm.get('shippingAddress');
  }

  get shippingMethod() {
    return this.shippingInfoForm.get('shippingMethod');
  }

  constructor(
    private orderService: OrderService,
    private shippingService: ShippingService,
    private checkoutService: CheckoutService,
    private route: ActivatedRoute,
    private router: Router,
    private addressService: AddressService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private updateOrderDetailsGlobally: UpdateOrderDetailsGlobally
  ) {}

  ngOnInit(): void {
    const addresses = this.route.snapshot.data['addresses'];
    this.customerAddresses = addresses
      ? JSON.parse(JSON.stringify(this.route.snapshot.data['addresses']))
      : [];
    this.customerAddresses.forEach((address) => {
      if (address.defaultShippingAddress) {
        this.shippingAddress?.setValue(address);
      }
    });

    const shipmentMethods = this.route.snapshot.data['eligibleShipmentMethods'];
    this.eligibleShipmentMethods = shipmentMethods
      ? JSON.parse(JSON.stringify(shipmentMethods))
      : [];
    this.shippingMethod?.setValue(
      this.eligibleShipmentMethods.find(
        (method) => method.code === 'standard-shipping'
      )
    );

    this.currentFormStatus = this.shippingInfoForm.status;
    this.updateNextButtonState(this.currentFormStatus);

    this.shippingInfoForm.statusChanges
      .pipe(
        filter((status) => status !== this.currentFormStatus),
        takeUntil(this.destroy$)
      )
      .subscribe((status) => {
        this.currentFormStatus = status;
        this.updateNextButtonState(status);
      });

    this.checkoutService.onNext$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onNext();
      });
  }

  updateNextButtonState(status: string) {
    if (status === 'VALID') {
      this.checkoutService.enableNextButton();
    } else {
      this.checkoutService.disableNextButton();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onNext(): void {
    let shippingAddress = this.shippingAddress?.value;
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

    this.orderService.setShippingInfo(shippingAddress, shippingAddress, this.shippingMethod?.value.id)
      .pipe(
        this.updateOrderDetailsGlobally.operator()
        ,takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          if ( res.__typename === 'Order' ) {
            this.router.navigate(['..', 'summary'], {
              relativeTo: this.route,
            });
          }
        }
      );
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
          this.shippingAddress?.setErrors({ required: true });
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
