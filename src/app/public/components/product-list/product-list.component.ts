import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subject, Subscription} from "rxjs";
import {map, takeUntil} from "rxjs/operators";
import {ProductService} from "../../../core/providers/product.service";

@Component({
  selector: 'gaushadhi-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  productListSubscription!: Subscription;
  products: any;
  productsCurrentlyShowing: any;
  loading: boolean = true;
  totalItems: number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (!this.products?.length) {
          this.router.navigate([], {
            queryParams: {
              'skip': null,
              'take': null,
              'search': null
            },
            queryParamsHandling: 'merge',
            relativeTo: this.route
          })
        }
        const skip = res.skip || 0;
        const take = res.take || 6;
      })

    this.productListSubscription = this.route.data.
      pipe(map((data) => data.productList),
      takeUntil(this.destroy$))
      .subscribe((productList) => {
        if (productList.__typename === 'ProductList') {
          this.totalItems = productList.totalItems;
          this.productsCurrentlyShowing = productList.items;
          this.loading = false;
        }
    });

    this.productListSubscription = this.productService.getProductList({
      skip: -1
    }).pipe(takeUntil(this.destroy$))
      .subscribe((productList) => {
      if (productList.__typename === 'ProductList') {
        this.totalItems = productList.totalItems;
        this.products = productList.items;
        this.loading = false;
      }
    });

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onPaginationChange(ev: any) {
    // this.loading = true;
    this.router.navigate(['store/products'], {
      queryParams: {
        skip: ev.pageSize * ev.pageIndex,
        take: ev.pageSize
      }
    })
  }
}
