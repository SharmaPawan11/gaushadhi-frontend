import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorResult } from '../../../common/vendure-types';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../providers/profile.service';

@Component({
  selector: 'gaushadhi-change-email-address',
  templateUrl: './change-email-address.component.html',
  styleUrls: ['./change-email-address.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeEmailAddressComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  // Request email change variables
  progressState: 'newEmailStep' | 'verificationStep' = 'newEmailStep';
  requestChangeError!: ErrorResult;
  hidePassword: boolean = true;
  changeEmailSentSuccessfully: boolean = false;
  requestChangeEmailGroup: FormGroup = this.fb.group({
    password: ['', [Validators.required]],
    newEmailAddress: ['', [Validators.required, Validators.email]],
  });

  // Change email variables
  token: string = '';
  updateText: string = 'Updating your email address...';
  updateInProgress: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.requestChangeEmailGroup.valueChanges.subscribe(() =>
    //   console.log(this.requestChangeEmailGroup)
    // );
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.token = token;
      this.progressState = 'verificationStep';
      this.onVerifyChangeEmail();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onRequestChange() {
    const formData = this.requestChangeEmailGroup.value;
    const requestUpdateEmailFormData = {
      password: formData.password,
      newEmailAddress: formData.newEmailAddress,
    };
    this.profileService
      .requestEmailUpdate(requestUpdateEmailFormData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        switch (res.__typename) {
          case 'EmailAddressConflictError':
          case 'InvalidCredentialsError':
          case 'NativeAuthStrategyError':
            console.log(res.message);
            this.requestChangeError = res;
            break;
          case 'Success':
            this.changeEmailSentSuccessfully = true;
        }
      });
  }

  onVerifyChangeEmail() {
    this.profileService
      .changeEmail(this.token)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.updateInProgress = false;
        switch (res.__typename) {
          case 'IdentifierChangeTokenExpiredError':
          case 'IdentifierChangeTokenInvalidError':
          case 'NativeAuthStrategyError':
            this.requestChangeError = res;
            this.updateText = res.message;
            break;
          case 'Success':
            this.updateText =
              'Your primary email has been changed successfully. You will receive updates on this email only';
        }
      });
  }
}
