import { Injectable } from '@angular/core';
import { RequestorService } from './requestor.service';
import { gql } from 'apollo-angular';
import {
  ASSET_FRAGMENT,
  FACET_VALUE_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
  TAX_RATE_FRAGMENT,
} from '../../common/framents.graph';
import { GetProductDetail } from '../../common/vendure-types';
import { filter, map } from 'rxjs/operators';
import { notNullOrNotUndefined } from '../../common/utils/not-null-or-not-undefined';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  GET_PRODUCT_DETAILS = gql`
    query product($productSlug: String!) {
      product(slug: $productSlug) {
        id
        name
        description
        variants {
          ...ProductVariant
        }
        facetValues {
          ...FacetValue
        }
        featuredAsset {
          id
          preview
        }
        assets {
          ...Asset
        }
        customFields {
          specifications
        }
      }
    }
    ${TAX_RATE_FRAGMENT}
    ${ASSET_FRAGMENT}
    ${FACET_VALUE_FRAGMENT}
    ${PRODUCT_VARIANT_FRAGMENT}
  `;
  constructor(private requestor: RequestorService) {}

  getProductDetails(productSlug: string) {
    return this.requestor
      .query<GetProductDetail.Query>(this.GET_PRODUCT_DETAILS, {
        productSlug,
      })
      .pipe(
        map((res) => res.product),
        filter(notNullOrNotUndefined)
      );
  }
}
