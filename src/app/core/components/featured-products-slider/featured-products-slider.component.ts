import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'gaushadhi-featured-products-slider',
  templateUrl: './featured-products-slider.component.html',
  styleUrls: ['./featured-products-slider.component.scss']
})
export class FeaturedProductsSliderComponent implements OnInit {
  //TODO: Indicator Dots
  @ViewChild('fpContainer', {read:ElementRef}) fpContainer!: ElementRef<HTMLUListElement>;

  featuredProducts = [
    {
      imageSource: '../../../../assets/images/gaushadhi-soap.png',
      brandName: 'Gaushadhi',
      variantName: 'Gaushadhi Bathing Soap',
      currentPrice: '80',
      strikethroughPrice: '100',
      ratingStars: 3,
      rating: 4.5,
      noOfRatings: 20,
      inStock: 32
    },
    {
      imageSource: '../../../../assets/images/gaushadhi-soap.png',
      brandName: 'Amazon',
      variantName: 'Amazon Shaving Cream',
      currentPrice: '100',
      strikethroughPrice: '150',
      ratingStars: 1,
      rating: 1.3,
      noOfRatings: 100,
      inStock: 16
    },
    {
      imageSource: '../../../../assets/images/gaushadhi-soap.png',
      brandName: 'Gaushadhi',
      variantName: 'Gaushadhi Bathing Soap',
      currentPrice: '80',
      strikethroughPrice: '100',
      ratingStars: 3,
      rating: 4.5,
      noOfRatings: 20,
      inStock: 8
    },
    {
      imageSource: '../../../../assets/images/gaushadhi-soap.png',
      brandName: 'Gaushadhi',
      variantName: 'Gaushadhi Bathing Soap',
      currentPrice: '80',
      strikethroughPrice: '100',
      ratingStars: 3,
      rating: 4.5,
      noOfRatings: 20,
      inStock: 32
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onLeftPress() {
    const noOfColumns = this.fpContainer.nativeElement.offsetWidth / 210
    this.fpContainer.nativeElement.scrollBy({ left: -(210 * noOfColumns), behavior: 'smooth' })
  }

  onRightPress() {
    const noOfColumns = this.fpContainer.nativeElement.offsetWidth / 210
    this.fpContainer.nativeElement.scrollBy({ left: 210 * noOfColumns, behavior: 'smooth' })
  }

}
