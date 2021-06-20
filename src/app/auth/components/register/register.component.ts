import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegisterService } from '../../providers/register.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  childrenEqualValidator,
  ConfirmValidParentMatcher,
} from '../../validators/childrenEqual.validator';
import { ErrorStateMatcher } from '@angular/material/core';
import { ErrorResult } from '../../../common/vendure-types';
import { Subscription } from 'rxjs';

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
    passwordGroup: this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: childrenEqualValidator }
    ),
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: ['', Validators.pattern('^([+]91)?[789]\\d{9}$')],
  });

  passwordEqualityMatcher: ErrorStateMatcher = new ConfirmValidParentMatcher();

  get firstName() {
    return this.registrationForm.get('firstName');
  }
  get lastName() {
    return this.registrationForm.get('lastName');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get password() {
    return this.registrationForm.get('passwordGroup.password');
  }
  get phoneNumber() {
    return this.registrationForm.get('phoneNumber');
  }

  constructor(
    private registerService: RegisterService,
    private fb: FormBuilder
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
      password: formData.passwordGroup.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber || ''
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
            console.log(res.success);
            if (res.success) {
              // Navigate
            }
        }
      });
  }
}
