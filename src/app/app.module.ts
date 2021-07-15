import { NgModule } from '@angular/core';
import { routes } from './app-routes';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, AuthComponent],
  imports: [CoreModule, RouterModule.forRoot(routes), SharedModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
