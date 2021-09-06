import { Injectable } from '@angular/core';
import { RequestorService } from '../../core/providers/requestor.service';
import { gql } from 'apollo-angular';
import { GetAccountOverview, SignIn } from '../../common/vendure-types';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ERROR_RESULT_FRAGMENT } from '../../common/framents.graph';
import { UserService } from '../../core/providers/user.service';
import { GET_ACTIVE_CUSTOMER } from '../../common/documents.graph';

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

  constructor(
    private requestor: RequestorService,
    private userService: UserService
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
        switchMap((res) => {
          switch (res.__typename) {
            case 'NotVerifiedError':
            case 'InvalidCredentialsError':
            case 'NativeAuthStrategyError':
              console.log(res.message);
              return of({
                errorCode: res.errorCode,
                message: res.message,
              });
            case 'CurrentUser':
              this.userService.setUserDetails(res.id);
              return this.requestor
                .query<GetAccountOverview.Query>(GET_ACTIVE_CUSTOMER, {
                  includeAddress: false,
                  includeProfile: true,
                  includeOrder: false,
                })
                .pipe(
                  map((res) => res.activeCustomer),
                  tap((res) => {
                    if (res?.emailAddress) {
                      localStorage.setItem(
                        'customerName',
                        res.firstName + res.lastName
                      );
                      localStorage.setItem('customerEmail', res.emailAddress);
                      localStorage.setItem(
                        'customerPhNo',
                        (res as any).phoneNumber || undefined
                      );
                    }
                  })
                );
            default:
              return of(null);
          }
        })
      );
  }
}
