import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../providers/login.service';
import { Subscription } from 'rxjs';
import { CurrentUser, ErrorResult } from '../../../common/vendure-types';
import { UserService } from '../../../core/providers/user.service';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'gaushadhi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  redirectUrl: string = '/account';
  userId!: string;
  loginError!: ErrorResult;
  loginSubscription!: Subscription;
  loginForm = this.fb.group(
    {
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [''],
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
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(filter((params) => params.redirectTo))
      .subscribe((params) => {
        this.redirectUrl = params['redirectTo'];
      });
  }

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
      .login(formData.email, formData.password, formData.rememberMe)
      .subscribe((res) => {
        if (res === null) {
          console.log('UNKNOWN ERROR WHILE TRYING TO LOG IN');
        } else if (res.errorCode) {
          console.log(res.errorCode, res.message);
        } else if (res.id) {
          console.log(res);
          this.router.navigate([this.redirectUrl || '/']);
        }
      });
  }
}
