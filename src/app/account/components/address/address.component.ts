import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddressService } from '../../providers/address.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/providers/user.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

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
  detectedCountry = '';
  subscriptions = [];

  addAddressForm: FormGroup = this.fb.group({
    id: [''],
    fullName: [''],
    company: [''],
    streetLine1: ['', [Validators.required]],
    streetLine2: [''],
    city: ['', [Validators.required]],
    province: ['', [Validators.required]],
    countryCode: ['', [Validators.required]],
    postalCode: [
      '',
      [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')],
    ],
    phoneNumber: [
      '',
      [Validators.required, Validators.pattern('^([+]91)?[789]\\d{9}$')],
    ],
    defaultShippingAddress: [false],
    defaultBillingAddress: [false],
  });

  get streetLine1() {
    return this.addAddressForm.get('streetLine1');
  }

  get city() {
    return this.addAddressForm.get('city');
  }

  get province() {
    return this.addAddressForm.get('province');
  }

  get countryCode() {
    return this.addAddressForm.get('countryCode');
  }

  get phoneNumber() {
    return this.addAddressForm.get('phoneNumber');
  }

  get postalCode() {
    return this.addAddressForm.get('postalCode');
  }

  constructor(
    private addressService: AddressService,
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Using slice because apollo returns immutable arrays
    this.customerAddresses = JSON.parse(JSON.stringify(this.route.snapshot.data['addresses']));

    const countryCodes$ = this.addressService.getCountryCodes().pipe(take(1));
    const geoLocation$ = this.userService.getUserGeolocationDetails();

    forkJoin([countryCodes$, geoLocation$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([countryCodeRes, geoLocationRes]) => {
        this.countries = countryCodeRes;
        if (geoLocationRes.status === 'success') {
          this.userGeolocationData = geoLocationRes;
          if (!this.city?.dirty) this.city?.setValue(geoLocationRes.city);
          if (!this.province?.dirty) this.province?.setValue(geoLocationRes.regionName);
          if (!this.postalCode?.dirty) this.postalCode?.setValue(geoLocationRes.zip);
        }

        if (Array.isArray(countryCodeRes) && countryCodeRes.length) {
          const detectedCountry = countryCodeRes.find((country: any) => {
            return country.code === geoLocationRes.countryCode;
          });
          if (detectedCountry) {
            if (!this.countryCode?.dirty) this.countryCode?.setValue(detectedCountry.code);
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onAddNewAddress() {
    if (this.addAddressForm.invalid) {
      return;
    }
    const {id, ...formData} = this.addAddressForm.value
    this.addressService
      .addAddress(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log(res);
        if (res.id) {
          this.customerAddresses.push(res);
          this.addAddressForm.reset()
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
        this.editedIndex = idx
        return address
      }
    })
    const formData = {
      id: customerAddress.id,
      fullName: customerAddress.fullName,
      city: customerAddress.city,
      company: customerAddress.company,
      phoneNumber: customerAddress.phoneNumber,
      postalCode: customerAddress.postalCode,
      province: customerAddress.province,
      defaultShippingAddress: customerAddress.defaultShippingAddress,
      defaultBillingAddress: customerAddress.defaultBillingAddress,
      streetLine1: customerAddress.streetLine1,
      streetLine2: customerAddress.streetLine2,
      countryCode: customerAddress.country.code
    }
    this.addAddressForm.setValue(formData);
    this.editMode = true;
  }

  onSaveAddress() {
    const formData: any = {}
    Object.keys(this.addAddressForm.controls).forEach(control => {
      const currentControl = this.addAddressForm.get(control);

      if (currentControl?.dirty) {
        formData[control] = currentControl.value;
      }
    });
    formData.id = this.addAddressForm.get('id')?.value;
    this.addressService
      .updateAddress(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.id) {
          if (formData.countryCode) {
            formData.country = {
              code: formData.countryCode
            }
            delete formData.countryCode
          }
          Object.assign(this.customerAddresses[this.editedIndex], formData)
          this.addAddressForm.reset();
        }
      });
  }

  onCancelAddressEdit() {
    this.editMode = false;
    this.addAddressForm.reset()
  }
}
