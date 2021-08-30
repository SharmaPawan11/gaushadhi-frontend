import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegisterService } from '../../providers/register.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ErrorResult } from '../../../common/vendure-types';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../../core/providers/snackbar.service';

@Component({
  selector: 'gaushadhi-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registrationSubscription!: Subscription;
  registrationError!: ErrorResult;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  registrationForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: ['', Validators.pattern('^([+]91)?[789]\\d{9}$')],
    terms: [
      '',
      [
        (control: FormControl) => {
          return !control.value ? { required: true } : null;
        },
      ],
    ],
  });

  get firstName() {
    return this.registrationForm.get('firstName');
  }
  get lastName() {
    return this.registrationForm.get('lastName');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get phoneNumber() {
    return this.registrationForm.get('phoneNumber');
  }
  get terms() {
    return this.registrationForm.get('terms');
  }

  constructor(
    private registerService: RegisterService,
    private fb: FormBuilder,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    if (this.registrationSubscription) {
      this.registrationSubscription.unsubscribe();
    }
  }

  onRegister() {
    if (this.registrationForm.invalid) {
      return;
    }
    const formData = this.registrationForm.value;
    const data = {
      emailAddress: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber || '',
    };
    this.registrationSubscription = this.registerService
      .registerUser(data)
      .subscribe((res) => {
        switch (res.__typename) {
          case 'MissingPasswordError':
          case 'NativeAuthStrategyError':
            console.log(res.message);
            this.registrationError = res;
            break;
          case 'Success':
            this.snackbarService.openSnackBar(
              'Please check your email to complete registration process',
              'Close',
              0
            );
            this.registrationForm.reset();
            [
              this.firstName,
              this.lastName,
              this.email,
              this.registrationForm.get('password'),
            ].forEach((control) => {
              control?.setErrors(null);
            });
        }
      });
  }
}
