import { Injectable } from '@angular/core';
import { RequestorService } from '../../core/providers/requestor.service';

import {
  ChangeEmailAddress,
  GetAccountOverview,
  UpdateCustomerDetails,
  VerifyChangeEmailAddress,
} from '../../common/vendure-types';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GET_ACTIVE_CUSTOMER } from '../../common/documents.graph';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  UPDATE_CUSTOMER_PROFILE_MUTATION = gql`
    mutation UpdateCustomerDetails(
      $updateCustomerInput: UpdateCustomerInput!
      $hasUpdatedTitle: Boolean!
      $hasUpdatedFirstName: Boolean!
      $hasUpdatedLastName: Boolean!
      $hasUpdatedPhoneNumber: Boolean!
    ) {
      updateCustomer(input: $updateCustomerInput) {
        title @include(if: $hasUpdatedTitle)
        firstName @include(if: $hasUpdatedFirstName)
        lastName @include(if: $hasUpdatedLastName)
        phoneNumber @include(if: $hasUpdatedPhoneNumber)
      }
    }
  `;

  REQUEST_EMAIL_ADDRESS_UPDATE_MUTATION = gql`
    mutation requestChangeEmailAddress(
      $password: String!
      $newEmailAddress: String!
    ) {
      requestUpdateCustomerEmailAddress(
        password: $password
        newEmailAddress: $newEmailAddress
      ) {
        ... on Success {
          success
        }
        ... on ErrorResult {
          errorCode
          message
        }
      }
    }
  `;

  VERIFY_CHANGE_EMAIL_ADDRESS_MUTATION = gql`
    mutation changeEmailAddress($token: String!) {
      updateCustomerEmailAddress(token: $token) {
        ... on Success {
          success
        }
        ... on ErrorResult {
          message
          errorCode
        }
      }
    }
  `;

  constructor(private requestor: RequestorService) {}

  getProfileData(): Observable<any> {
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
            localStorage.setItem('customerName', res.firstName + res.lastName);
            localStorage.setItem('customerEmail', res.emailAddress);
            localStorage.setItem(
              'customerPhNo',
              (res as any).phoneNumber || undefined
            );
          }
        })
      );
  }

  updateCustomerProfile(
    fieldEdited: string,
    fieldNewValue: string
  ): Observable<any> {
    const updateProfileMutationVariable: any = {
      updateCustomerInput: {},
      hasUpdatedTitle: false,
      hasUpdatedFirstName: false,
      hasUpdatedLastName: false,
      hasUpdatedPhoneNumber: false,
    };

    updateProfileMutationVariable.updateCustomerInput[fieldEdited] =
      fieldNewValue;

    switch (fieldEdited) {
      case 'firstName':
        updateProfileMutationVariable.hasUpdatedFirstName = true;
        break;
      case 'lastName':
        updateProfileMutationVariable.hasUpdatedLastName = true;
        break;
      case 'phoneNumber':
        updateProfileMutationVariable.hasUpdatedPhoneNumber = true;
        break;
      case 'hasUpdatedTitle':
        updateProfileMutationVariable.hasUpdatedTitle = true;
        break;
    }

    return this.requestor
      .mutate<UpdateCustomerDetails.Mutation, UpdateCustomerDetails.Variables>(
        this.UPDATE_CUSTOMER_PROFILE_MUTATION,
        updateProfileMutationVariable
      )
      .pipe(map((res) => res.updateCustomer));
  }

  requestEmailUpdate({
    password,
    newEmailAddress,
  }: {
    password: string;
    newEmailAddress: string;
  }) {
    const requestEmailUpdateMutationVariable: any = {
      password,
      newEmailAddress,
    };

    return this.requestor
      .mutate<ChangeEmailAddress.Mutation>(
        this.REQUEST_EMAIL_ADDRESS_UPDATE_MUTATION,
        requestEmailUpdateMutationVariable
      )
      .pipe(map((res) => res.requestUpdateCustomerEmailAddress));
  }

  changeEmail(token: string) {
    return this.requestor
      .mutate<
        VerifyChangeEmailAddress.Mutation,
        VerifyChangeEmailAddress.Variables
      >(this.VERIFY_CHANGE_EMAIL_ADDRESS_MUTATION, { token })
      .pipe(map((res) => res.updateCustomerEmailAddress));
  }
}
