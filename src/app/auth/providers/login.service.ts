import { Injectable } from '@angular/core';
import { RequestorService } from '../../core/providers/requestor.service';
import { gql } from 'apollo-angular';
import { SignIn } from '../../common/vendure-types';
import { map } from 'rxjs/operators';

@Injectable()
export class LoginService {
  LOGIN_MUTATION = gql`
    mutation ($emailAddress: String!, $password: String!) {
      login(username: $emailAddress, password: $password, rememberMe: false) {
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
        ... on InvalidCredentialsError {
          errorCode
          message
          authenticationError
        }
        ... on NotVerifiedError {
          errorCode
          message
        }
        ... on NativeAuthStrategyError {
          errorCode
          message
        }
      }
    }
  `;

  constructor(private requestor: RequestorService) {}

  login(emailAddress: string, password: string, rememberMe?: boolean) {
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
