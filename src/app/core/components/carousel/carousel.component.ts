import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gaushadhi-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  carouselImagesList = [
    'https://source.unsplash.com/random/1000x2000',
  ]
  currentIndex = 0;
  firstLoad = true;
  carouselLoaded = false;

  constructor() { }

  ngOnInit(): void {
  }

  onNext() {
    this.currentIndex++;
    if (this.currentIndex >= this.carouselImagesList.length) {
      this.currentIndex = 0;
    }
    if (this.firstLoad) this.firstLoad = false;
  }

  onPrev() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.carouselImagesList.length - 1;
    }
    if (this.firstLoad) this.firstLoad = false;

  }

}
