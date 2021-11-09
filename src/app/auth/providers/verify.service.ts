import { Injectable } from '@angular/core';
import { RequestorService } from '../../core/providers/requestor.service';
import {filter, map} from 'rxjs/operators';
import { gql } from 'apollo-angular';
import { ERROR_RESULT_FRAGMENT } from '../../common/framents.graph';
import {SaveCustomerInfoOnSuccessfulLogin} from "../../core/operators/save-customer-info-on-successful-login";
import {notNullOrNotUndefined} from "../../common/utils/not-null-or-not-undefined";
import {Observable} from "rxjs";

@Injectable()
export class VerifyService {
  VERIFY_MUTATION = gql`
    mutation VerifyCustomerAccount($token: String!) {
      verifyCustomerAccount(token: $token, password: "") {
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

  constructor(private requestor: RequestorService,
  private saveCustomerInfo: SaveCustomerInfoOnSuccessfulLogin) {}

  verify(token: string, password: string): Observable<any> {
    const verifyMutationVariable = {
      token,
      password: password || '',
    };
    return this.requestor
      .mutate(
        this.VERIFY_MUTATION,
        verifyMutationVariable
      )
      .pipe(map((res) => res.verifyCustomerAccount),
        this.saveCustomerInfo.operator(),
        filter(notNullOrNotUndefined)
      );
  }
}
