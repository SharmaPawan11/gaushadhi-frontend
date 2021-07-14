import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { RequestorService } from '../../core/providers/requestor.service';
import { Register, RegisterCustomerInput } from '../../common/vendure-types';
import { map } from 'rxjs/operators';
import { ERROR_RESULT_FRAGMENT } from '../../common/framents.graph';

@Injectable()
export class RegisterService {
  REGISTER_USER_MUTATION = gql`
    mutation ($registerCustomerInput: RegisterCustomerInput!) {
      registerCustomerAccount(input: $registerCustomerInput) {
        __typename
        ... on Success {
          success
        }
        ...ErrorResult
      }
    }
    ${ERROR_RESULT_FRAGMENT}
  `;
  constructor(private requestor: RequestorService) {}

  registerUser(registerDataObject: RegisterCustomerInput) {
    return this.requestor
      .mutate<Register.Mutation>(this.REGISTER_USER_MUTATION, {
        registerCustomerInput: registerDataObject,
      })
      .pipe(map((res) => res.registerCustomerAccount));
  }
}
