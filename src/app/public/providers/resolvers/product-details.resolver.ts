import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ProductService } from '../../../core/providers/product.service';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsResolver implements Resolve<any> {
  constructor(private productService: ProductService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const slug: string = route.params['slug'];
    return this.productService.getProductDetails(slug).pipe(take(1));
  }
}
