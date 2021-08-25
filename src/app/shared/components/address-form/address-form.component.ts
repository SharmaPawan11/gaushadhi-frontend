import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { AddressService } from '../../../core/providers/address.service';
import { UserService } from '../../../core/providers/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'gaushadhi-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressFormComponent),
      multi: true,
    },
  ],
})
export class AddressFormComponent
  implements OnInit, ControlValueAccessor, Validator
{
  destroy$: Subject<boolean> = new Subject<boolean>();
  countries: any;
  userGeolocationData: Object = {};
  onChange: () => void = () => {};
  onTouched: () => void = () => {};

  addressForm: FormGroup = this.fb.group({
    id: [''],
    fullName: ['', [Validators.required]],
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
  });

  get fullName() {
    return this.addressForm.get('fullName');
  }

  get streetLine1() {
    return this.addressForm.get('streetLine1');
  }

  get city() {
    return this.addressForm.get('city');
  }

  get province() {
    return this.addressForm.get('province');
  }

  get countryCode() {
    return this.addressForm.get('countryCode');
  }

  get phoneNumber() {
    return this.addressForm.get('phoneNumber');
  }

  get postalCode() {
    return this.addressForm.get('postalCode');
  }

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddressFormComponent>
  ) {}

  ngOnInit(): void {
    let customerAddress = this.data.addressData;
    if (customerAddress) {
      const formData = this.extractRequiredFields(customerAddress);
      this.addressForm.setValue(formData, { emitEvent: true });
    }

    const countryCodes$ = this.addressService.getCountryCodes().pipe(take(1));
    const geoLocation$ = this.userService.getUserGeolocationDetails();

    forkJoin([countryCodes$, geoLocation$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([countryCodeRes, geoLocationRes]) => {
        this.countries = countryCodeRes;
        if (geoLocationRes.status === 'success') {
          this.userGeolocationData = geoLocationRes;
          if (!this.city?.dirty) this.city?.setValue(geoLocationRes.city);
          if (!this.province?.dirty)
            this.province?.setValue(geoLocationRes.regionName);
          if (!this.postalCode?.dirty)
            this.postalCode?.setValue(geoLocationRes.zip);
        }

        if (Array.isArray(countryCodeRes) && countryCodeRes.length) {
          const detectedCountry = countryCodeRes.find((country: any) => {
            return country.code === geoLocationRes.countryCode;
          });
          if (detectedCountry) {
            if (!this.countryCode?.dirty)
              this.countryCode?.setValue(detectedCountry.code);
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  extractRequiredFields(customerAddress: any) {
    return {
      id: customerAddress.id,
      fullName: customerAddress.fullName,
      city: customerAddress.city,
      company: customerAddress.company,
      phoneNumber: customerAddress.phoneNumber,
      postalCode: customerAddress.postalCode,
      province: customerAddress.province,
      defaultShippingAddress: customerAddress.defaultShippingAddress,
      streetLine1: customerAddress.streetLine1,
      streetLine2: customerAddress.streetLine2,
      countryCode: customerAddress.country.code,
    };
  }

  saveChanges() {
    this.dialogRef.close({
      data: this.addressForm.value,
      newAddress: this.data.newAddress,
    });
  }

  writeValue(obj: any): void {
    if (!obj) {
      this.addressForm.reset();
    } else {
      const formData = this.extractRequiredFields(obj);
      this.addressForm.setValue(formData, { emitEvent: true });
    }
  }

  registerOnChange(fn: any): void {
    this.addressForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(fn);
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  validate(control: AbstractControl): ValidationErrors | null {
    return this.addressForm.valid
      ? null
      : {
          invalidForm: {
            valid: false,
            message: 'AddressForm fields are invalid',
          },
        };
  }
}
