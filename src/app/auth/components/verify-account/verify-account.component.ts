import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorResult, Verify } from '../../../common/vendure-types';
import { VerifyService } from '../../providers/verify.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/providers/user.service';

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
    private userService: UserService
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
          switch (res.__typename) {
            case 'VerificationTokenInvalidError':
            case 'VerificationTokenExpiredError':
            case 'NativeAuthStrategyError':
            case 'PasswordAlreadySetError':
            case 'MissingPasswordError':
              this.progressState = 'verificationFinished';
              this.loginError = res;
              break;
            case 'CurrentUser':
              this.progressState = 'verificationFinished';
              this.userId = res.id;
              this.userService.setUserDetails(this.userId);
              setTimeout(() => {
                this.router.navigate(['account']);
              }, 2000);
          }
        });
    }
  }

  ngOnDestroy(): void {
    if (this.verifySubscription) {
      this.verifySubscription.unsubscribe();
    }
  }
}
