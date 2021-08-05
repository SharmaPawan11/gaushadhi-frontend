import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gaushadhi-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  //TODO: Additional Templating eg. breadcrumbs
  productSpecifications = {
    Brand: 'Gaushadhi',
    'Variant Name': 'Gaushadhi Bathing Soap',
    Weight: '80g ',
    'Pack of': '1',
    'Ideal for': 'Men & Women',
    Composition: 'GOMAYA, GERU, MULTANI MITTI, NEEM, CAMPHOR',
    Color: 'Brown',
    Type: 'Bathing Soap',
    'Skin Type': 'All Skin Types',
    'Application Area': 'Body, Face',
  };
  showSpecifications = false;
  quantity = 1;
  currentSelectedImage = '../../../../assets/images/gaushadhi-soap.png';
  additionalImages = [
    {
      url: '../../../../assets/images/gaushadhi-soap.png',
    },
    {
      url: '../../../../assets/images/gaushadhi-soap-2.png',
    },
    {
      url: '../../../../assets/images/gaushadhi-soap-3.png',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
