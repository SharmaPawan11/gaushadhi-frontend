import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../../core/providers/product.service';
import { ActivatedRoute } from '@angular/router';
import {filter, map, takeUntil, tap} from 'rxjs/operators';
import { notNullOrNotUndefined } from '../../../common/utils/not-null-or-not-undefined';
import { Subject } from 'rxjs';
import { GetProductDetail } from '../../../common/vendure-types';
import { CartService } from '../../../core/providers/cart.service';
import { SnackbarService } from '../../../core/providers/snackbar.service';
import { OrderService } from '../../../core/providers/order.service';
import {
  UpdateOrderDetailsGlobally
} from "../../../core/operators/update-order-details-globally.operator";
import {SetDefaultShippingOnFirstItemAdd} from "../../../core/operators/set-default-shipping-on-first-item-add";

@Component({
  selector: 'gaushadhi-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  //TODO: Additional Templating eg. breadcrumbs
  destroy$: Subject<boolean> = new Subject<boolean>();
  productDetails!: GetProductDetail.Product;
  selectedAsset!: { id: string; preview: string };
  selectedVariant!: GetProductDetail.Variants;

  productSpecifications: any;
  //   = {
  //   Brand: 'Gaushadhi',
  //   'Variant Name': 'Gaushadhi Bathing Soap',
  //   Weight: '80g ',
  //   'Pack of': '1',
  //   'Ideal for': 'Men & Women',
  //   Composition: 'GOMAYA, GERU, MULTANI MITTI, NEEM, CAMPHOR',
  //   Color: 'Brown',
  //   Type: 'Bathing Soap',
  //   'Skin Type': 'All Skin Types',
  //   'Application Area': 'Body, Face',
  // };
  showSpecifications = false;
  quantity = 1;
  currentSelectedImage = '';
  additionalImages = [
    // {
    //   url: '../../../../assets/images/gaushadhi-soap.png',
    // },
    // {
    //   url: '../../../../assets/images/gaushadhi-soap-2.png',
    // },
    // {
    //   url: '../../../../assets/images/gaushadhi-soap-3.png',
    // },
  ];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private snackbarService: SnackbarService,
    private orderService: OrderService,
    private updateOrderDetailsGlobally: UpdateOrderDetailsGlobally,
    private setDefaultShippingOnFirstItemAdd: SetDefaultShippingOnFirstItemAdd
  ) {}

  ngOnInit(): void {
    this.route.data
      .pipe(
        map((data) => data.productDetails),
        filter(notNullOrNotUndefined),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.productDetails = data;
        if (this.productDetails.featuredAsset) {
          this.selectedAsset = this.productDetails?.featuredAsset;
        }
        this.selectedVariant = this.productDetails.variants[0];
        this.productSpecifications = JSON.parse(
          JSON.parse((this.productDetails as any).customFields.specifications)
        );
        console.log(this.productSpecifications);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onAddToCart() {
    this.cartService.addToCart(this.selectedVariant.id, this.quantity)
      .pipe(
        this.updateOrderDetailsGlobally.operator(),
        this.setDefaultShippingOnFirstItemAdd.operator(),
        takeUntil(this.destroy$))
      .subscribe((res) => {
        switch (res?.__typename) {
          case 'Order':
            this.snackbarService.openSnackBar(
              `${this.quantity} item(s) has been added to your cart`
            );
            break;
        }
      });
  }
}
