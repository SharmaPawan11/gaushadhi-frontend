import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreComponent } from './core.component';

@NgModule({
  declarations: [CoreComponent],
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule
  ]
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
