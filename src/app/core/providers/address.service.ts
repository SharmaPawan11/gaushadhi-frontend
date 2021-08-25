import { Component, Injectable } from '@angular/core';
import { RequestorService } from './requestor.service';
import { gql } from 'apollo-angular';
import {
  CreateAddress,
  CreateAddressInput,
  GetAvailableCountries,
  GetCustomerAddresses,
  Success,
  UpdateAddress,
  UpdateAddressInput,
} from '../../common/vendure-types';
import { catchError, map, share, take, tap } from 'rxjs/operators';
import { Observable, of, Subject, switchMap } from 'rxjs';
import { ADDRESS_FRAGMENT } from '../../common/framents.graph';
import {
  GET_ACTIVE_CUSTOMER,
  GET_CUSTOMER_ADDRESSES,
} from '../../common/documents.graph';
import { AddressFormComponent } from '../../shared/components/address-form/address-form.component';
import { MatDialog } from '@angular/material/dialog';

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
  `;

  constructor(private requestor: RequestorService, private dialog: MatDialog) {}

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
        updateAddressInput: updateAddressDataObject,
      })
      .pipe(map((res) => res.updateCustomerAddress));
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

  openAddressDialog(componentToRender: any, addressData: any) {
    const dialogRef = this.dialog.open(componentToRender, {
      data: {
        addressData,
        newAddress: !(addressData && addressData.id),
      },
      width: '90%',
    });

    return dialogRef.afterClosed().pipe(
      switchMap((result) => {
        if (!result.data) {
          return of({
            dialogReturnValue: result,
            obs: null,
          });
        }

        if (result.data.defaultShippingAddress) {
          result.data.defaultBillingAddress = true;
        }

        if (result.newAddress) {
          const { id, ...formData } = result.data;
          return of({
            dialogReturnValue: result,
            obs: this.addAddress(formData),
          });
        } else {
          return of({
            dialogReturnValue: result,
            obs: this.updateAddress(result.data),
          });
        }
      })
    );
  }
}
