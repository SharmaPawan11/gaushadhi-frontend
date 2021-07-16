import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AddressService } from '../address.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AddressResolver implements Resolve<any> {
  constructor(private addressService: AddressService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.addressService.getAddresses().pipe(take(1));
  }
}
