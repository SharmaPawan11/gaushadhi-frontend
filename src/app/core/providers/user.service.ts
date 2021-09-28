import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { RequestorService } from './requestor.service';
import {SignOut} from '../../common/vendure-types';
import { catchError, map, share, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private requestor: RequestorService,
    private httpClient: HttpClient,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  get isAuthenticated(): boolean {
    const authToken = localStorage.getItem('authToken');
    return !!authToken;

    // return this.requestor.query<GetActiveCustomer.Query>(GET_ACTIVE_CUSTOMER, {
    //   includeAddress: false,
    //   includeProfile: true,
    //   includeOrder: false,
    // }).pipe(map((res) => res.activeCustomer),
    //         map((res) => {
    //           return !!(res && res.id);
    //         }))
  }

  setUserDetails(userId: string) {
    localStorage.setItem('userId', userId);
  }

  getUserProfileDetails() {
    return {
      name: localStorage.getItem('customerName'),
      email: localStorage.getItem('customerEmail'),
      userId: localStorage.getItem('userId')
    }
  }

  removeUserDetails() {
    localStorage.clear();
  }

  logout() {
    const LOGOUT_MUTATION = gql`
      mutation {
        logout {
          success
        }
      }
    `;
    this.requestor
      .mutate<SignOut.Mutation>(LOGOUT_MUTATION)
      .pipe(map((res) => res.logout))
      .subscribe((res) => {
        if (res.success) {
          this.removeUserDetails();
          this.snackbarService.openSnackBar('You have been logged out.');
          this.router.navigate(['login']);
        }
      });
  }

  getUserGeolocationDetails(): Observable<any> {
    return this.httpClient.get('https://api.ipgeolocation.io/ipgeo?apiKey=9b8be2367db840ebb4fd0aa856dbbaff&fields=country_code2,zipcode,state_prov,city').pipe(
      catchError((error) => of(null)),
      share()
    );
  }
}
