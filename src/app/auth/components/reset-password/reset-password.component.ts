import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from '../../providers/reset-password.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorResult } from '../../../common/vendure-types';
import { UserService } from '../../../core/providers/user.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gaushadhi-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  // Request reset variables
  progressState: 'emailStep' | 'passwordStep' = 'emailStep';
  email = new FormControl(null, [Validators.required, Validators.email]);
  requestResetError!: ErrorResult;
  resetEmailSentSuccessfully: boolean = false;

  // Change password variables
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  token: string = '';
  userId: string = '';
  newPassword: FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private route: ActivatedRoute,
    private resetService: ResetPasswordService,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.token = token;
      this.progressState = 'passwordStep';
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onRequestReset() {
    if (this.email.invalid) {
      return;
    }
    const enteredEmail = this.email.value;
    this.resetService
      .requestResetPassword(enteredEmail)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res?.__typename === 'NativeAuthStrategyError') {
          console.log(res.message);
        } else if (res?.__typename === 'Success') {
          this.resetEmailSentSuccessfully = true;
        }
      });
  }

  onReset() {
    if (this.newPassword.invalid) {
      return;
    }
    const formData = this.newPassword.value;
    this.resetService
      .resetPassword(this.token, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        switch (res.__typename) {
          case 'PasswordResetTokenInvalidError':
          case 'PasswordResetTokenExpiredError':
          case 'NativeAuthStrategyError':
            console.log(res.message);
            this.requestResetError = res;
            break;
          case 'CurrentUser':
            console.log(res.id);
            this.userId = res.id;
            this.userService.setUserDetails(this.userId);
        }
      });
  }
}
