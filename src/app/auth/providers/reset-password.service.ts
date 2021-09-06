import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { RequestorService } from '../../core/providers/requestor.service';
import {
  RequestPasswordReset,
  RequestPasswordResetResult,
  ResetPassword,
} from '../../common/vendure-types';
import { map } from 'rxjs/operators';
import { ERROR_RESULT_FRAGMENT } from '../../common/framents.graph';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  REQUEST_RESET_PASSWORD_MUTATION = gql`
    mutation ($emailAddress: String!) {
      requestPasswordReset(emailAddress: $emailAddress) {
        __typename
        ... on Success {
          success
        }
        ...ErrorResult
      }
    }
    ${ERROR_RESULT_FRAGMENT}
  `;

  RESET_PASSWORD_MUTATION = gql`
    mutation ($token: String!, $password: String!) {
      resetPassword(token: $token, password: $password) {
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

  requestResetPassword(emailAddress: string) {
    const requestResetPasswordMutationVariable = {
      emailAddress,
    };
    return this.requestor
      .mutate<RequestPasswordReset.Mutation, RequestPasswordReset.Variables>(
        this.REQUEST_RESET_PASSWORD_MUTATION,
        requestResetPasswordMutationVariable
      )
      .pipe(map((res) => res.requestPasswordReset));
  }

  resetPassword(token: string, newPassword: string) {
    const resetPasswordMutationVariable = {
      token,
      password: newPassword,
    };

    return this.requestor
      .mutate<ResetPassword.Mutation, ResetPassword.Variables>(
        this.RESET_PASSWORD_MUTATION,
        resetPasswordMutationVariable
      )
      .pipe(map((res) => res.resetPassword));
  }
}
