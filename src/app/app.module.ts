import { NgModule } from '@angular/core';
import { routes } from './app-routes';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LandingPageComponent } from './core/components/landing-page/landing-page.component';
import { CategoryComponent } from './core/components/category/category.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LandingPageComponent,
    CategoryComponent,
  ],
  imports: [
    CoreModule,
    RouterModule.forRoot(routes),
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
