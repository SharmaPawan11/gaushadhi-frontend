import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../providers/profile.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../core/providers/snackbar.service';

@Component({
  selector: 'gaushadhi-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  changePasswordGroup: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required]],
  });
  hideCurrentPassword: boolean = true;
  changePasswordSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    if (this.changePasswordSubscription) {
      this.changePasswordSubscription.unsubscribe();
    }
  }

  onChangePassword() {
    this.changePasswordSubscription = this.profileService
      .changePassword({
        currentPassword: this.changePasswordGroup.value.currentPassword,
        newPassword: this.changePasswordGroup.value.newPassword,
      })
      .subscribe((res) => {
        if (res.__typename === 'Success') {
          this.changePasswordGroup.reset();
          this.changePasswordGroup.get('currentPassword')?.setErrors(null);
          this.snackbarService.openSnackBar('Password updated successfully');
        } else if (res.__typename === 'InvalidCredentialsError') {
          this.snackbarService.openSnackBar('Invalid current password');
        }
      });
  }
}
