import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'gaushadhi-category-slider',
  templateUrl: './category-slider.component.html',
  styleUrls: ['./category-slider.component.scss']
})
export class CategorySliderComponent implements OnInit, AfterViewInit {

  @ViewChild('categoryContainer', {read:ElementRef}) categoryContainer!: ElementRef<HTMLUListElement>;
  gridColumnStyle = {};
  noOfColumnsInOneSlide = 0;

  categories = [
    {
      name: 'Soaps',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, voluptatem.'
    },
    {
      name: 'Soaps2',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, voluptatem.'
    },
    {
      name: 'Soaps3',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, voluptatem.'
    },
    {
      name: 'Soaps4',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, voluptatem.'
    },
    {
      name: 'Soaps5',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, voluptatem.'
    },
    {
      name: 'Soaps6',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, voluptatem.'
    },
    {
      name: 'Soaps7',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, voluptatem.'
    },
    {
      name: 'Soaps8',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, voluptatem.'
    },
    {
      name: 'Soaps9',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, voluptatem.'
    },
    {
      name: 'Soaps10',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, voluptatem.'
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.noOfColumnsInOneSlide = Math.floor(this.categoryContainer.nativeElement.offsetWidth / 225)
    // setTimeout(() => {
    //   this.gridColumnStyle = {
    //     ['grid-template-columns.px']: (this.categoryContainer.nativeElement.offsetWidth / noOfColumns).toString(),
    //     ['grid-auto-columns.px']: (this.categoryContainer.nativeElement.offsetWidth / noOfColumns).toString()
    //   }
    // }, 0)
  }

  onLeftPress() {
    const noOfColumns = this.categoryContainer.nativeElement.offsetWidth / 225
    this.categoryContainer.nativeElement.scrollBy({ left: -(225 * noOfColumns), behavior: 'smooth' })
  }

  onRightPress() {
    const noOfColumns = this.categoryContainer.nativeElement.offsetWidth / 225
    this.categoryContainer.nativeElement.scrollBy({ left: 225 * noOfColumns, behavior: 'smooth' })
  }
}
