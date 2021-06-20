import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../providers/login.service';
import { Subscription } from 'rxjs';
import { CurrentUser, ErrorResult } from '../../../common/vendure-types';
import { UserService } from '../../../core/providers/user.service';
import { FormBuilder, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'gaushadhi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  userId!: string;
  loginError!: ErrorResult;
  loginSubscription!: Subscription;
  loginForm = this.fb.group(
    {
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
    },
    {
      // updateOn: "blur"
    }
  );
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const formData = this.loginForm.value;
    this.loginSubscription = this.loginService
      .login(formData.email, formData.password)
      .subscribe((res) => {
        switch (res.__typename) {
          case 'NotVerifiedError':
          case 'InvalidCredentialsError':
          case 'NativeAuthStrategyError':
            console.log(res.message);
            this.loginError = res;
            break;
          case 'CurrentUser':
            console.log(res.id);
            this.userId = res.id;
            this.userService.currentUserId = this.userId;
        }
      });
  }
}
