import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../providers/login.service';
import {of, Subscription} from 'rxjs';
import { CurrentUser, ErrorResult } from '../../../common/vendure-types';
import { UserService } from '../../../core/providers/user.service';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {catchError, filter} from 'rxjs/operators';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {AuthService} from "../../providers/auth.service";
import {SnackbarService} from "../../../core/providers/snackbar.service";
import {notNullOrNotUndefined} from "../../../common/utils/not-null-or-not-undefined";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'gaushadhi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  redirectUrl: string = '/';
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
  googleSignInUrl!: string;
  facebookSignInUrl!: string;
  loginInProgress: boolean = false;
  state: string = 'default';

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
    private router: Router,
    private domSanitizer: DomSanitizer,
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {
    const userProfileDetails = this.userService.getUserProfileDetails();

    const googleScopes = 'scope=https%3A//www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile%20openid';
    const googleClientId = 'client_id=' + environment.googleClientId;
    const googleRedirectUri = 'redirect_uri=' + environment.googleRedirectUri;

    const facebookScopes = 'scope=public_profile,email';
    const facebookClientId = 'client_id=' + environment.facebookClientId;
    const facebookRedirectUri = 'redirect_uri=' + environment.facebookRedirectUri;

    this.authService.getSha256Hash(userProfileDetails.email, userProfileDetails.userId, userProfileDetails.name, 'default').then((hash) => {
      this.state = hash;
      const state = 'state=' + hash;
      this.googleSignInUrl = `https://accounts.google.com/o/oauth2/v2/auth?${googleScopes}&include_granted_scopes=true&response_type=code&${state}&${googleRedirectUri}&${googleClientId}`;
      this.facebookSignInUrl = `https://www.facebook.com/v11.0/dialog/oauth?${facebookClientId}&${facebookRedirectUri}&${state}&${facebookScopes}`;
    });
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(filter((params) => params.redirectTo))
      .subscribe((params) => {
        this.redirectUrl = params['redirectTo'];
      });

    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');
    const hasError = !!this.route.snapshot.queryParamMap.get('error');
    if (code && !hasError) {
      this.loginInProgress = true;

      const isGoogleSignIn = !!localStorage.getItem('googleSignInState');
      const isFacebookSignIn = !!localStorage.getItem('facebookSignInState');
      let provider = undefined;

      if (isGoogleSignIn) {
        if (localStorage.getItem('googleSignInState') !== state) {
          this.snackbarService.openSnackBar('Invalid Google Auth-code', 0);
          this.loginInProgress = false;
          this.removeOAuthParams();
        } else {
          provider = 'google';
        }
      }

      if (isFacebookSignIn) {
        if (localStorage.getItem('facebookSignInState') !== state) {
          this.snackbarService.openSnackBar('Invalid Facebook Auth-code', 0);
          this.loginInProgress = false;
          this.removeOAuthParams();
        } else {
          provider = 'facebook';
        }
      }

      if (provider) {
        this.loginService.thirdPartyLogin(code, provider).subscribe(async (res:any) => {
          if (res.errorCode) {
            this.snackbarService.openSnackBar(res.message, 0);
          } else if (res.id) {
            await this.router.navigate([this.redirectUrl || '/']);
          } else {
            this.snackbarService.openSnackBar('Server error, Please contact support at support@gaushadhi.com');
            this.removeOAuthParams();
          }
          this.loginInProgress = false;
        })
      }
    } else if (hasError) {
      this.snackbarService.openSnackBar('Please allow access to Gaushadhi in order to Signin / Signup.', 0);
      this.removeOAuthParams();
    }
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
    this.loginInProgress = true;
    const formData = this.loginForm.value;
    this.loginSubscription = this.loginService
      .login(formData.email, formData.password, formData.rememberMe)
      .pipe(
        catchError((err) => {
          if (err.message === 'error.native-authentication-methods-not-found') {
            this.loginInProgress = false;
            this.snackbarService.openSnackBar('You have not registered using email. Please login via Google/Facebook.', 0)
          }
          return of(null);
        }),
        filter(notNullOrNotUndefined)
      )
      .subscribe((res) => {
        if (res.errorCode) {
          this.loginInProgress = false;
          this.snackbarService.openSnackBar(res.message, 0);
        } else if (res.id) {
          this.router.navigate([this.redirectUrl || '/']);
        }
      });
  }

  onGoogleSignIn() {
    window.open(this.googleSignInUrl, '_self');
    localStorage.setItem('googleSignInState', this.state);
    localStorage.removeItem('facebookSignInState');
  }

  onFacebookSignIn() {
    window.open(this.facebookSignInUrl, '_self');
    localStorage.setItem('facebookSignInState', this.state);
    localStorage.removeItem('googleSignInState');
  }

  removeOAuthParams() {
    this.router.navigate([], {
      queryParams: {
        'state': null,
        'code': null,
        'scope': null,
        'authuser': null,
        'prompt': null,
        'error': null,
        'error_code': null,
        'error_reason': null,
        'error_description': null,
        'hd': null
      },
      queryParamsHandling: 'merge'
    })
  }

}
