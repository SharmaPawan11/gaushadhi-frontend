import { Injectable } from '@angular/core';
import { RequestorService } from '../../core/providers/requestor.service';

import {
  GetAccountOverview,
  UpdateCustomerDetails,
} from '../../common/vendure-types';
import { map } from 'rxjs/operators';
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

  constructor(private requestor: RequestorService) {}

  getProfileData(): Observable<any> {
    return this.requestor
      .query<GetAccountOverview.Query>(GET_ACTIVE_CUSTOMER, {
        includeAddress: false,
        includeProfile: true,
        includeOrder: false,
      })
      .pipe(map((res) => res.activeCustomer));
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
      hasUpdatedPhoneNumber: false
    }

    updateProfileMutationVariable.updateCustomerInput[fieldEdited] = fieldNewValue

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

    return this.requestor.mutate<UpdateCustomerDetails.Mutation, UpdateCustomerDetails.Variables>(
      this.UPDATE_CUSTOMER_PROFILE_MUTATION, updateProfileMutationVariable
    ).pipe(map((res) => res.updateCustomer));
  }

  requestEmailAddressUpdate() {

  }
}
