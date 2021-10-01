import { Injectable } from '@angular/core';
import { RequestorService } from '../../core/providers/requestor.service';
import { gql } from 'apollo-angular';
import { GetAccountOverview, SignIn } from '../../common/vendure-types';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ERROR_RESULT_FRAGMENT } from '../../common/framents.graph';
import { UserService } from '../../core/providers/user.service';
import {notNullOrNotUndefined} from "../../common/utils/not-null-or-not-undefined";
import {SaveCustomerInfoOnSuccessfulLogin} from "../../core/operators/save-customer-info-on-successful-login";

@Injectable()
export class LoginService {
  LOGIN_MUTATION = gql`
    mutation Login(
      $emailAddress: String!
      $password: String!
      $rememberMe: Boolean
    ) {
      login(
        username: $emailAddress
        password: $password
        rememberMe: $rememberMe
      ) {
        __typename
        ... on CurrentUser {
          id
          identifier
          channels {
            id
            token
            code
            permissions
          }
        }
        ...ErrorResult
      }
    }
    ${ERROR_RESULT_FRAGMENT}
  `;

  GOOGLE_LOGIN_MUTATION = gql`
    mutation Authenticate(
      $codeInput: AuthenticationInput!
    ) {
        authenticate(input: $codeInput) {
        __typename
        ...on CurrentUser {
            id
            identifier
        }
      }
    }
  `

  constructor(
    private requestor: RequestorService,
    private userService: UserService,
    private saveCustomerInfo: SaveCustomerInfoOnSuccessfulLogin
  ) {}

  login(
    emailAddress: string,
    password: string,
    rememberMe?: boolean
  ): Observable<any> {
    const loginMutationVariable = {
      emailAddress,
      password,
      rememberMe: rememberMe || false,
    };
    return this.requestor
      .mutate<SignIn.Mutation, SignIn.Variables>(
        this.LOGIN_MUTATION,
        loginMutationVariable
      )
      .pipe(
        map((res) => res.login),
        this.saveCustomerInfo.operator(),
        filter(notNullOrNotUndefined)
      );
  }

  thirdPartyLogin(code: string, provider: string) {
    return this.requestor.mutate(this.GOOGLE_LOGIN_MUTATION,{
      codeInput:{
        [provider]: {
          code
        }
      }
    }).pipe(
      map((res) => res.authenticate),
      this.saveCustomerInfo.operator(),
    );
  }
}
