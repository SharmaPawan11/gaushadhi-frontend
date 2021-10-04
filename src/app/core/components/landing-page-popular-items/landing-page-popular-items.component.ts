import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../../providers/product.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'gaushadhi-landing-page-popular-items',
  templateUrl: './landing-page-popular-items.component.html',
  styleUrls: ['./landing-page-popular-items.component.scss']
})
export class LandingPagePopularItemsComponent implements OnInit, OnDestroy {
  popularProductsSubscription!: Subscription;
  featuredProduct: any = {};
  popularProducts: Array<any> = [];
  discountPercentage: number = 0;

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.productService.getPopularProducts().subscribe((res) => {
      this.featuredProduct = res.items.find((product: any) => {
        return product.variants[0].customFields.is_featured === true;
      })
      console.log(this.featuredProduct.variants[0].customFields.strikethrough_price, this.featuredProduct.variants[0].priceWithTax )
      this.discountPercentage = +this.featuredProduct.variants[0].customFields.strikethrough_price - +(this.featuredProduct.variants[0].priceWithTax / 100)
      console.log(this.discountPercentage)

      this.popularProducts = res.items.filter((product: any) => {
        return product.id !== this.featuredProduct.id
      })
    })
  }

  ngOnDestroy() {
    if (this.popularProductsSubscription) {
      this.popularProductsSubscription.unsubscribe();
    }
  }

}
