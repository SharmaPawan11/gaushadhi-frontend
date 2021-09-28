import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { HttpLink } from 'apollo-angular/http';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DefaultInterceptor } from './providers/interceptors/default-interceptor.service';
import { ShellComponent } from './components/shell/shell.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarouselDirective } from './directives/carousel.directive';
import { CarouselComponent } from './components/carousel/carousel.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {environment} from "../../environments/environment";
import {MatButtonModule} from "@angular/material/button";
import { LandingHeroComponent } from './components/landing-hero/landing-hero.component';
import { LandingPagePopularItemsComponent } from './components/landing-page-popular-items/landing-page-popular-items.component';
import {FormatPriceModule} from "../custom/pipes/format-price/format-price.module";

@NgModule({
  declarations: [
    ShellComponent,
    NavbarComponent,
    CarouselDirective,
    CarouselComponent,
    FooterComponent,
    LandingHeroComponent,
    LandingPagePopularItemsComponent,
  ],
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    FormatPriceModule
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    CarouselDirective,
    CarouselComponent,
    LandingHeroComponent,
    LandingPagePopularItemsComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: ApolloLink.from([
            setContext(() => {
              if (environment.tokenMethod === 'bearer') {
                const authToken = localStorage.getItem('authToken');
                if (authToken) {
                  return {
                    headers: {
                      authorization: `Bearer ${authToken}`,
                    },
                  };
                }
                return {};
              }
              return {};
            }), httpLink.create({
            uri: environment.serverUrl,
            withCredentials: true,
          })])
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
