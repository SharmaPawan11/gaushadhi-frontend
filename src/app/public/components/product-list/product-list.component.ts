import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subject, Subscription} from "rxjs";
import {map, takeUntil} from "rxjs/operators";
import {ProductService} from "../../../core/providers/product.service";
import {CollectionService} from "../../../core/providers/collection.service";
import {CartService} from "../../../core/providers/cart.service";
import {SnackbarService} from "../../../core/providers/snackbar.service";
import {UpdateOrderDetailsGlobally} from "../../../core/operators/update-order-details-globally.operator";
import {SetDefaultShippingOnFirstItemAdd} from "../../../core/operators/set-default-shipping-on-first-item-add";

@Component({
  selector: 'gaushadhi-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  productListSubscription!: Subscription;
  products: Array<any> = [];
  filteredProducts: Array<any> = [];
  paginatedProducts: Array<any> = [];
  loading: boolean = true;
  totalItems: number = 0;
  activeCollections: Array<string> = [''];
  skip: number = 0;
  take: number = -1;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private collectionService: CollectionService,
    private cartService: CartService,
    private snackbarService: SnackbarService,
    private updateOrderDetailsGlobally: UpdateOrderDetailsGlobally,
    private setDefaultShippingOnFirstItemAdd: SetDefaultShippingOnFirstItemAdd
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
        this.skip = res.skip || 0;
        this.take = res.take || 6;
        this.updatePagination();
      });

    this.productListSubscription = this.route.data.
      pipe(map((data) => data.productList),
      takeUntil(this.destroy$))
      .subscribe((productList) => {
        if (productList.__typename === 'ProductList') {
          this.totalItems = productList.totalItems;
          this.products = productList.items;
          this.filteredProducts = this.products;
          this.loading = false;
        }
    });

    const activeCollectionsIds$ = this.collectionService.activeCollectionsIds$
      .pipe(takeUntil(this.destroy$))

    activeCollectionsIds$.subscribe((activeCollectionIds) => {
      this.activeCollections = activeCollectionIds;

      if (this.activeCollections.length) {
        this.filteredProducts = [];
        this.products.forEach((product) => {
          const collectionInput = product.collections;
          const thisProductCollectionIds = collectionInput.reduce((prev: Array<string>, current: {id: string}) => {
            prev.push(current.id);
            return prev;
          }, []);

          const isInFilteredCollections = (this.intersect(thisProductCollectionIds, this.activeCollections)).length;
          if (isInFilteredCollections) {
            this.filteredProducts.push(product);
          }
        });
      } else {
        this.filteredProducts = this.products;
      }
      this.updatePagination();
    });

    // this.productListSubscription = this.productService.getProductList({
    //   skip: -1
    // }).pipe(takeUntil(this.destroy$))
    //   .subscribe((productList) => {
    //   if (productList.__typename === 'ProductList') {
    //     this.totalItems = productList.totalItems;
    //     this.products = productList.items;
    //     this.loading = false;
    //   }
    // });

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

  intersect(arr1: Array<string>, arr2: Array<string>) {
    const arr1Map: any = {}
    const arr2Map: any = {}
    const intersection: Array<string> = [];

    arr1.forEach((elem) => {
      arr1Map[elem] = true;
    })

    arr2.forEach((elem) => {
      arr2Map[elem] = true;
    })

    Object.keys(arr1Map).forEach((key) => {
      if (arr2Map[key] === true) {
        intersection.push(key);
      }
    })

    return intersection
  }

  paginate(inputArray: Array<any>, skip: number, take: number) {
    skip = +skip;
    take = +take;
    return inputArray.slice(skip, skip + take);
  }

  updatePagination() {
    this.paginatedProducts = this.paginate(this.filteredProducts, this.skip, this.take);
  }

  onAddToCart(product: any, e: MouseEvent) {
    const productId = product.variants[0].id;
    e.stopPropagation();
    this.cartService.addToCart(productId, 1)
      .pipe(this.updateOrderDetailsGlobally.operator(),
        this.setDefaultShippingOnFirstItemAdd.operator())
      .subscribe((res) => {
      switch (res?.__typename) {
        case 'Order':
          this.snackbarService.openSnackBar(
            `1 item(s) has been added to your cart`
          );
          break;
      }
    })
  }

  onClickProduct(slug: string) {
    console.log(slug);
    this.router.navigate(['./', slug], {
      relativeTo: this.route
    })
  }
}
