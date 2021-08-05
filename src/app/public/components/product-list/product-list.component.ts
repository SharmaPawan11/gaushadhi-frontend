import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gaushadhi-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products = [
    {
      imageSource: '../../../../assets/images/gaushadhi-soap.png',
      brandName: 'Gaushadhi',
      variantName: 'Gaushadhi Bathing Soap',
      currentPrice: '80',
      strikethroughPrice: '100',
      ratingStars: 3,
      rating: 4.5,
      noOfRatings: 20,
      inStock: 32,
    },
    {
      imageSource: '../../../../assets/images/gaushadhi-manjan.png',
      brandName: 'Gaushadhi',
      variantName: 'Gaushadhi Dant Manjan',
      currentPrice: '80',
      strikethroughPrice: '100',
      ratingStars: 3,
      rating: 4.5,
      noOfRatings: 20,
      inStock: 15,
    },
    {
      imageSource: '../../../../assets/images/dhoopbatti-2.png',
      brandName: 'Gaushadhi',
      variantName: 'Gaushadhi Dhoop Batti',
      currentPrice: '80',
      strikethroughPrice: '100',
      ratingStars: 3,
      rating: 4.5,
      noOfRatings: 20,
      inStock: 8,
    },
    {
      imageSource: '../../../../assets/images/hawanstick.png',
      brandName: 'Gaushadhi',
      variantName: 'Gaushadhi Hawan Stick',
      currentPrice: '80',
      strikethroughPrice: '100',
      ratingStars: 3,
      rating: 4.5,
      noOfRatings: 20,
      inStock: 32,
    },
    {
      imageSource: '../../../../assets/images/gaushadhi-cake-2.png',
      brandName: 'Gaushadhi',
      variantName: 'Gaushadhi Cake',
      currentPrice: '80',
      strikethroughPrice: '100',
      ratingStars: 3,
      rating: 4.5,
      noOfRatings: 20,
      inStock: 32,
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
      inStock: 32,
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
