import { Injectable } from '@angular/core';
import { RequestorService } from '../../core/providers/requestor.service';
import { gql } from 'apollo-angular';
import {
  CreateAddress,
  CreateAddressInput,
  GetAvailableCountries,
  GetCustomerAddresses,
  Success, UpdateAddress, UpdateAddressInput,
} from '../../common/vendure-types';
import { catchError, map, share, take, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ADDRESS_FRAGMENT } from '../../common/framents.graph';
import {
  GET_ACTIVE_CUSTOMER,
  GET_CUSTOMER_ADDRESSES,
} from '../../common/documents.graph';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  ADD_ADDRESS_MUTATION = gql`
    mutation ($customerInput: CreateAddressInput!) {
      createCustomerAddress(input: $customerInput) {
        ...Address
      }
    }
    ${ADDRESS_FRAGMENT}
  `;

  DELETE_ADDRESS_MUTATION = gql`
    mutation ($id: ID!) {
      deleteCustomerAddress(id: $id) {
        success
      }
    }
  `;

  GET_AVAILABLE_COUNTRIES = gql`
    query {
      availableCountries {
        code
        name
        enabled
      }
    }
  `;

  UPDATE_CUSTOMER_ADDRESS_MUTATION = gql`
    mutation updateCustomerAddress($updateAddressInput: UpdateAddressInput!) {
    updateCustomerAddress(input: $updateAddressInput) {
      id
    }
  }
  `

  constructor(private requestor: RequestorService) {}

  addAddress(createAddressDataObject: CreateAddressInput) {
    return this.requestor
      .mutate<CreateAddress.Mutation>(this.ADD_ADDRESS_MUTATION, {
        customerInput: createAddressDataObject,
      })
      .pipe(map((res) => res.createCustomerAddress));
  }

  deleteAddress(addressId: string): Observable<Success> {
    return this.requestor
      .mutate(this.DELETE_ADDRESS_MUTATION, {
        id: addressId,
      })
      .pipe(map((res) => res.deleteCustomerAddress));
  }

  updateAddress(updateAddressDataObject: UpdateAddressInput) {
    return this.requestor
      .mutate<UpdateAddress.Mutation>(this.UPDATE_CUSTOMER_ADDRESS_MUTATION, {
        updateAddressInput: updateAddressDataObject
      })
      .pipe(map((res)=> res.updateCustomerAddress))
  }

  getAddresses() {
    return this.requestor
      .query<GetCustomerAddresses.Query>(GET_ACTIVE_CUSTOMER, {
        includeAddress: true,
        includeProfile: false,
        includeOrder: false,
      })
      .pipe(map((res) => res.activeCustomer?.addresses));
  }

  getCountryCodes() {
    return this.requestor
      .query<GetAvailableCountries.Query>(this.GET_AVAILABLE_COUNTRIES)
      .pipe(
        map((res) => res.availableCountries),
        catchError((err) => of(null)),
        share()
      );
  }
}
