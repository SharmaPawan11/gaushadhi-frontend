import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from '../../providers/reset-password.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  childrenEqualValidator,
  ConfirmValidParentMatcher,
} from '../../validators/childrenEqual.validator';
import { Subscription } from 'rxjs';
import { ErrorResult } from '../../../common/vendure-types';
import { UserService } from '../../../core/providers/user.service';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'gaushadhi-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  // Request reset variables
  progressState: 'emailStep' | 'passwordStep' = 'emailStep';
  email = new FormControl(null, [Validators.required, Validators.email]);
  requestResetError!: ErrorResult;
  resetEmailSentSuccessfully: boolean = false;
  requestResetSubscription!: Subscription;

  // Change password variables
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  token: string = '';
  userId: string = '';
  resetSubscription!: Subscription;
  newPasswordForm: FormGroup = this.fb.group(
    {
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: childrenEqualValidator }
  );

  passwordEqualityMatcher: ErrorStateMatcher = new ConfirmValidParentMatcher();

  get password() {
    return this.newPasswordForm.get('password');
  }
  get confirmPassword() {
    return this.newPasswordForm.get('confirmPassword');
  }

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
    if (this.requestResetSubscription) {
      this.requestResetSubscription.unsubscribe();
    }
    if (this.resetSubscription) {
      this.resetSubscription.unsubscribe();
    }
  }

  onRequestReset() {
    if (this.email.invalid) {
      return;
    }
    const enteredEmail = this.email.value;
    this.requestResetSubscription = this.resetService
      .requestResetPassword(enteredEmail)
      .subscribe((res) => {
        if (res?.__typename === 'NativeAuthStrategyError') {
          console.log(res.message);
        } else if (res?.__typename === 'Success') {
          this.resetEmailSentSuccessfully = true;
        }
      });
  }

  onReset() {
    if (this.newPasswordForm.invalid) {
      return;
    }
    const formData = this.newPasswordForm.value;
    this.resetSubscription = this.resetService
      .resetPassword(this.token, formData.password)
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
            this.userService.currentUserId = this.userId;
        }
      });
  }
}
