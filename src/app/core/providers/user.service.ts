import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { RequestorService } from './requestor.service';
import { SignOut } from '../../common/vendure-types';
import { catchError, map, share, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private requestor: RequestorService,
    private httpClient: HttpClient
  ) {}

  get isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  setUserDetails(userId: string) {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userId', userId);
  }

  removeUserDetails() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
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
        }
      });
  }

  getUserGeolocationDetails(): Observable<any> {
    return this.httpClient.get('http://ip-api.com/json/?fields=57663').pipe(
      catchError((error) => of(null)),
      share()
    );
  }
}
