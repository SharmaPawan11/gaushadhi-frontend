import { Component, OnInit } from '@angular/core';
import {
  ProfileService,
  updatedControl,
} from '../../providers/profile.service';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../core/providers/snackbar.service';

@Component({
  selector: 'gaushadhi-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userProfileData!: any;
  userProfileForm!: FormGroup;
  currentlyEditing: string = '';
  password!: FormControl;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.userProfileData = { ...this.route.snapshot.data['profile'] };

    this.userProfileForm = this.fb.group({
      title: [this.userProfileData.title || 'Title'],
      firstName: [
        this.userProfileData.firstName,
        // [Validators.required, Validators.pattern('^[a-zA-Z]{3,20}$')],
        [Validators.required]
      ],
      lastName: [
        this.userProfileData.lastName,
        [Validators.required],
      ],
      phoneNumber: [
        this.userProfileData.phoneNumber,
        [Validators.required, Validators.pattern('^([+]91)?[789]\\d{9}$')],
      ],
      emailAddress: {
        value: this.userProfileData.emailAddress,
        disabled: true,
      },
    });
  }

  onProfileFormSubmit() {
    const updatedControls: Array<updatedControl> = [];

    Object.keys(this.userProfileForm.controls).forEach((formControl) => {
      if (this.userProfileForm.controls[formControl].dirty) {
        updatedControls.push({
          fieldEdited: formControl,
          fieldNewValue: this.userProfileForm.controls[formControl].value,
        });
      }
    });

    this.profileService
      .updateCustomerProfile(updatedControls)
      .subscribe((res) => {
        if (res.__typename === 'Customer') {
          this.userProfileForm.markAsPristine();
          this.snackbarService.openSnackBar('Profile updated successfully');
        }
      });
  }
}
