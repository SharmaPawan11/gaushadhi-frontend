import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { UNIVERSAL_LOCAL_STORAGE } from '@ng-web-apis/universal';


@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
  providers: [UNIVERSAL_LOCAL_STORAGE]
})
export class AppServerModule {}
