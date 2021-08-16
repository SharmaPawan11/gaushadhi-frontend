import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'gaushadhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @ViewChild("scrollPoint",  { read: ElementRef }) scrollPoint!: any;
  quantity = 1;

  items = [
    {
      variantName: 'Gaushadhi Bathing Soap',
      brandName: 'Gaushadhi',
      strikethroughPrice: 100,
      price: 80,
      quantity: 1,
      image: 'assets/images/gaushadhi-manjan.png'
    },
    // {
    //   variantName: 'Gaushadhi Bathing Soap',
    //   brandName: 'Gaushadhi',
    //   strikethroughPrice: 100,
    //   price: 80,
    //   quantity: 1,
    //   image: 'assets/images/dhoopbatti.png'
    // },
    // {
    //   variantName: 'Gaushadhi Bathing Soap',
    //   brandName: 'Gaushadhi',
    //   strikethroughPrice: 100,
    //   price: 80,
    //   quantity: 1,
    //   image: 'assets/images/gaushadhi-soap.png'
    // },

  ]
  constructor() { }

  ngOnInit(): void {
  }

  scrollToProductDetails() {
    this.scrollPoint.nativeElement.scrollIntoView({
      behavior:"smooth"
    })
  }

}
