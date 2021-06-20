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
              this.loginError = res;
              break;
            case 'CurrentUser':
              console.log(res);
              this.userId = res.id;
              this.userService.currentUserId = this.userId;
            // this.router.navigate(['/account']);
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
