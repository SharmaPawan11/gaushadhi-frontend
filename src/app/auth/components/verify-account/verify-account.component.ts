import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorResult } from '../../../common/vendure-types';
import { VerifyService } from '../../providers/verify.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'gaushadhi-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss'],
})
export class VerifyAccountComponent implements OnInit, OnDestroy {
  password: string = '';
  userId!: string;
  loginError!: ErrorResult;
  verifySubscription!: Subscription;
  progressState: 'verificationInProgress' | 'verificationFinished' =
    'verificationInProgress';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private verifyService: VerifyService,
  ) {}

  ngOnInit(): void {
    this.verify();
  }

  verify() {
    const password = this.password;
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.verifySubscription = this.verifyService
        .verify(token, password)
        .subscribe((res) => {
          // console.log(res);
          if (res.errorCode) {
            this.progressState = 'verificationFinished';
            this.loginError = res.message;
            // this.snackbarService.openSnackBar(res.message, 0);
          } else if (res.id) {
            this.progressState = 'verificationFinished';
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
            // this.router.navigate([this.redirectUrl || '/']);
            // this.router.navigate(['/']);
          }

          // switch (res.__typename) {
          //   case 'VerificationTokenInvalidError':
          //   case 'VerificationTokenExpiredError':
          //   case 'NativeAuthStrategyError':
          //   case 'PasswordAlreadySetError':
          //   case 'MissingPasswordError':
          //     this.progressState = 'verificationFinished';
          //     this.loginError = res;
          //     break;
          //   case 'CurrentUser':
          //     this.progressState = 'verificationFinished';
          //     this.userId = res.id;
          //     this.userService.setUserId(this.userId);
          //     setTimeout(() => {
          //       this.router.navigate(['store', 'products']);
          //     }, 2000);
          // }
        });
    }
  }

  ngOnDestroy(): void {
    if (this.verifySubscription) {
      this.verifySubscription.unsubscribe();
    }
  }
}
