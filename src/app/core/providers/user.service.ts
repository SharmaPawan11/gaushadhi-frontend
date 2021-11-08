import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { RequestorService } from './requestor.service';
import { catchError, map, share, take, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { UpdateOrderDetailsGlobally } from "../operators/update-order-details-globally.operator";

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
    customerName: localStorage.getItem('customerName'),
    customerEmail: localStorage.getItem('customerEmail'),
    customerPhNo: localStorage.getItem('customerPhNo')
  });
  userProfile$ = this.userProfile.asObservable();

  constructor(
    private requestor: RequestorService,
    private httpClient: HttpClient,
    private router: Router,
    private snackbarService: SnackbarService,
    private updateOrderDetailsGlobally: UpdateOrderDetailsGlobally
  ) {
    this.updateIsAuthenticated();
  }

  get hasAuthToken(): boolean {
    const authToken = localStorage.getItem('authToken');
    return !!authToken;
  }

  updateUserProfile(userProfileData: UserProfile) {
    this.userProfile.next(userProfileData);
    localStorage.setItem('customerName', userProfileData.customerName || '');
    localStorage.setItem('customerEmail', userProfileData.customerEmail || '');
    localStorage.setItem('customerPhNo', userProfileData.customerPhNo || '');
  }

  updateIsAuthenticated() {
    this.isAuthenticatedSubject.next(this.hasAuthToken);
    this.isAuthenticated = this.hasAuthToken;
  }

  setUserId(userId: string) {
    localStorage.setItem('userId', userId);
    this.updateIsAuthenticated();
  }

  getUserProfileDetails() {
    return {
      name: localStorage.getItem('customerName'),
      email: localStorage.getItem('customerEmail'),
      userId: localStorage.getItem('userId'),
      phNo: localStorage.getItem('customerPhNo')
    }
  }

  removeUserDetails() {
    localStorage.clear();
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
