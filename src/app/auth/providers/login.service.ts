import { Injectable } from '@angular/core';
import { RequestorService } from '../../core/providers/requestor.service';
import { gql } from 'apollo-angular';
import { SignIn } from '../../common/vendure-types';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ERROR_RESULT_FRAGMENT } from '../../common/framents.graph';
import { UserService } from '../../core/providers/user.service';

@Injectable()
export class LoginService {
  LOGIN_MUTATION = gql`
    mutation (
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

  constructor(private requestor: RequestorService) {}

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
      .pipe(map((res) => res.login));
  }
}
