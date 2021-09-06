import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import {filter, take} from 'rxjs/operators';
import { ProductService } from '../../../core/providers/product.service';
import {notNullOrNotUndefined} from "../../../common/utils/not-null-or-not-undefined";

@Injectable({
  providedIn: 'root'
})
export class ProductListResolver implements Resolve<any> {
  constructor(private productService: ProductService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const queryParams = (route.queryParamMap as any).params;
    return this.productService.getProductList({
      skip: queryParams.skip,
      take: queryParams.take
    }).pipe(
      filter(notNullOrNotUndefined),
      take(1));
  }
}
