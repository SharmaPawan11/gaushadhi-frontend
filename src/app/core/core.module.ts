import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DefaultInterceptor } from './providers/interceptors/default-interceptor.service';
import { ShellComponent } from './components/shell/shell.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarouselDirective } from './directives/carousel.directive';
import { CarouselComponent } from './components/carousel/carousel.component';
import { CategorySliderComponent } from './components/category-slider/category-slider.component';
import { FeaturedProductsSliderComponent } from './components/featured-products-slider/featured-products-slider.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductFilterComponent } from './components/product-filter/product-filter.component';
import { SharedModule } from '../shared/shared.module';
import { ProductListComponent } from './components/product-list/product-list.component';
import { MatChipsModule } from '@angular/material/chips';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { FooterComponent } from './components/footer/footer.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import {MatBadgeModule} from "@angular/material/badge";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    ShellComponent,
    NavbarComponent,
    CarouselDirective,
    CarouselComponent,
    CategorySliderComponent,
    FeaturedProductsSliderComponent,
    ProductsComponent,
    ProductFilterComponent,
    ProductListComponent,
    ProductDetailComponent,
    FooterComponent,
    PlaygroundComponent,
  ],
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    MatIconModule,
    SharedModule,
    MatChipsModule,
    MatTabsModule,
    MatExpansionModule,
    MatBadgeModule,
    MatButtonModule
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    CarouselDirective,
    CarouselComponent,
    CategorySliderComponent,
    FeaturedProductsSliderComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:3000/shop-api',
            withCredentials: true,
          }),
          // defaultOptions: {
          //   watchQuery: {
          //     errorPolicy: 'ignore'
          //   }
          // }
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class CoreModule {
  // To ensure that CoreModule is imported only once.
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule has already been loaded. You should only import Core modules in the AppModule only.'
      );
    }
  }
}
