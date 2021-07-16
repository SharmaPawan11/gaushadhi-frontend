import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddressService } from '../../../core/providers/address.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { UserService } from '../../../core/providers/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gaushadhi-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  editedIndex: number = -1;
  editMode: boolean = false;
  countries: any;
  userGeolocationData: Object = {};
  customerAddresses: Array<any> = [];
  addressForm = new FormControl('', []);

  constructor(
    private addressService: AddressService,
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Using JSON.parse(JSON.stringify()) as apollo returns immutable arrays
    this.customerAddresses = JSON.parse(
      JSON.stringify(this.route.snapshot.data['addresses'])
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onAddNewAddress() {
    if (this.addressForm.invalid) {
      return;
    }
    const { id, ...formData } = this.addressForm.value;
    this.addressService
      .addAddress(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log(res);
        if (res.id) {
          this.customerAddresses.push(res);
          this.addressForm.reset();
          console.log('ADDRESS ADDED SUCCESSFULLY', res);
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
          console.log('Address Deleted Successfully');
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

    this.addressForm.setValue(customerAddress);
    this.editMode = true;
  }

  onSaveAddress() {
    const formData = this.addressForm.value;
    this.addressForm.reset();
    this.addressService
      .updateAddress(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.id) {
          if (formData.countryCode) {
            formData.country = {
              code: formData.countryCode,
            };
            delete formData.countryCode;
          }
          Object.assign(this.customerAddresses[this.editedIndex], formData);
          this.addressForm.reset();
          this.editMode = false;
        }
      });
  }

  onCancelAddressEdit() {
    this.editMode = false;
    this.addressForm.reset();
  }
}
