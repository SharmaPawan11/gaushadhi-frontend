import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

export interface CarouselContext {
  $implicit: string;
  controller: {
    next: () => void;
    prev: () => void;
  };
  index: number;
  currentImageIndex: number;
}

@Directive({
  selector: '[gaushadhiCarousel]',
})
export class CarouselDirective implements OnInit {
  constructor(
    private tmpl: TemplateRef<CarouselContext>,
    private vcr: ViewContainerRef
  ) {}

  @Input('gaushadhiCarouselFrom') images!: string[];

  contexts: CarouselContext[] = [];
  currentImageIndex: number = 0;

  ngOnInit(): void {
    this.images.forEach((image, idx) => {
      const context = {
        $implicit: this.images[idx],
        controller: {
          next: () => this.next(),
          prev: () => this.prev(),
        },
        currentImageIndex: this.currentImageIndex,
        index: idx,
      };
      this.contexts.push(context);
      this.vcr.createEmbeddedView(this.tmpl, context);
    });
  }

  next(): void {
    this.currentImageIndex++;
    if (this.currentImageIndex >= this.images.length) {
      this.currentImageIndex = 0;
    }
    this.contexts.forEach((context) => {
      context.currentImageIndex = this.currentImageIndex;
    });
  }

  prev(): void {
    this.currentImageIndex--;
    if (this.currentImageIndex < 0) {
      this.currentImageIndex = this.images.length - 1;
    }
    this.contexts.forEach((context) => {
      context.currentImageIndex = this.currentImageIndex;
    });
  }
}
