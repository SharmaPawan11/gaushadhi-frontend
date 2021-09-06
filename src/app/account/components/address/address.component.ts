import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddressService } from '../../../core/providers/address.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { UserService } from '../../../core/providers/user.service';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, switchMap } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AddressFormComponent } from '../../../custom/components/address-form/address-form.component';
import { SnackbarService } from '../../../core/providers/snackbar.service';

@Component({
  selector: 'gaushadhi-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  editedIndex: number = -1;
  countries: any;
  userGeolocationData: Object = {};
  customerAddresses: Array<any> = [];
  updatedAddress: any = {};

  constructor(
    private addressService: AddressService,
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    // Using JSON.parse(JSON.stringify()) as apollo returns immutable arrays
    const addresses = this.route.snapshot.data['addresses'];
    this.customerAddresses = addresses
      ? JSON.parse(JSON.stringify(addresses))
      : [];
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
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

  onAddNewAddress() {
    this.openAddressDialog();
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
}
