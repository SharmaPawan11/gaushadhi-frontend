import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../providers/profile.service';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

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
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userProfileData = { ...this.route.snapshot.data['profile'] };

    this.password = new FormControl('');
    this.userProfileForm = this.fb.group({
      title: [this.userProfileData.title],
      firstName: [
        this.userProfileData.firstName,
        [Validators.pattern('^[a-zA-Z]{3,20}$')],
      ],
      lastName: [
        this.userProfileData.lastName,
        [Validators.pattern('^[a-zA-Z]{3,20}$')],
      ],
      phoneNumber: [
        this.userProfileData.phoneNumber,
        [Validators.pattern('^([+]91)?[789]\\d{9}$')],
      ],
      emailAddress: [this.userProfileData.emailAddress, [Validators.email]],
    });
  }

  // onProfileFormSubmit() {
  //   Object.keys(this.userProfileForm.controls).forEach((formControl) => {
  //     console.log(this.userProfileForm.controls[formControl]);
  //   });
  // }

  onEditStart(controlBeingEdited: string) {
    this.userProfileForm.setValue({
      title: this.userProfileData.title,
      firstName: this.userProfileData.firstName,
      lastName: this.userProfileData.lastName,
      emailAddress: this.userProfileData.emailAddress,
      phoneNumber: this.userProfileData.phoneNumber,
    });
    this.currentlyEditing = controlBeingEdited;
  }

  onEditDone(controlEdited: string) {
    console.log(controlEdited);
    if (!this.userProfileForm.controls[controlEdited].pristine) {
      if (controlEdited === 'emailAddress') {
        console.log(this.password.value);
      } else {
        this.profileService
          .updateCustomerProfile(
            controlEdited,
            this.userProfileForm.controls[controlEdited].value
          )
          .subscribe((res) => {
            console.log(res);
            this.userProfileData[controlEdited] = res[controlEdited];
            this.currentlyEditing = '';
          });
      }
    }
  }

  isControlValid(controlName: string) {
    return this.userProfileForm.controls[controlName].valid;
  }
}
