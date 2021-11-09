import {Inject, Injectable} from '@angular/core';
import { gql } from 'apollo-angular';
import { RequestorService } from './requestor.service';
import { catchError, map, share, take, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { UpdateOrderDetailsGlobally } from "../operators/update-order-details-globally.operator";
import {LOCAL_STORAGE} from "@ng-web-apis/common";

export type UserProfile = {
  customerName: string | null;
  customerEmail: string | null;
  customerPhNo: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasAuthToken);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  isAuthenticated: boolean = false;
  private userProfile = new BehaviorSubject<UserProfile>({
    customerName: this.localStorage.getItem('customerName'),
    customerEmail: this.localStorage.getItem('customerEmail'),
    customerPhNo: this.localStorage.getItem('customerPhNo')
  });
  userProfile$ = this.userProfile.asObservable();

  constructor(
    private requestor: RequestorService,
    private httpClient: HttpClient,
    private router: Router,
    private snackbarService: SnackbarService,
    private updateOrderDetailsGlobally: UpdateOrderDetailsGlobally,
    @Inject(LOCAL_STORAGE) private localStorage: Storage
  ) {
    this.updateIsAuthenticated();
  }

  get hasAuthToken(): boolean {
    const authToken = this.localStorage.getItem('authToken');
    return !!authToken;
  }

  updateUserProfile(userProfileData: UserProfile) {
    this.userProfile.next(userProfileData);
    this.localStorage.setItem('customerName', userProfileData.customerName || '');
    this.localStorage.setItem('customerEmail', userProfileData.customerEmail || '');
    this.localStorage.setItem('customerPhNo', userProfileData.customerPhNo || '');
  }

  updateIsAuthenticated() {
    this.isAuthenticatedSubject.next(this.hasAuthToken);
    this.isAuthenticated = this.hasAuthToken;
  }

  setUserId(userId: string) {
    this.localStorage.setItem('userId', userId);
    this.updateIsAuthenticated();
  }

  getUserProfileDetails() {
    return {
      name: this.localStorage.getItem('customerName'),
      email: this.localStorage.getItem('customerEmail'),
      userId: this.localStorage.getItem('userId'),
      phNo: this.localStorage.getItem('customerPhNo')
    }
  }

  removeUserDetails() {
    this.localStorage.clear();
    this.updateIsAuthenticated();
  }

  logout(){
    const LOGOUT_MUTATION = gql`
      mutation {
        logout {
          success
        }
      }
    `;
    this.requestor
      .mutate(LOGOUT_MUTATION)
      .pipe(map((res) => res.logout),
        this.updateOrderDetailsGlobally.operator(),
        take(1))
      .subscribe((res) => {
        if (res.success) {
          this.removeUserDetails();
          // this.router.navigateByUrl(this.router.url);
          this.snackbarService.openSnackBar('You have been logged out.');
          this.router.navigate(['']);
        }
      });
  }

  getUserGeolocationDetails(): Observable<any> {
    return this.httpClient.get('https://api.ipgeolocation.io/ipgeo?apiKey=9b8be2367db840ebb4fd0aa856dbbaff&fields=country_code2,zipcode,state_prov,city').pipe(
      catchError((error) => of(null)),
      tap(console.log),
      share()
    );
  }
}
