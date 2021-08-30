import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CommonModule } from '@angular/common';
import { routes } from './auth-routes';
import { RouterModule } from '@angular/router';
import { VerifyAccountComponent } from './components/verify-account/verify-account.component';
import { LoginService } from './providers/login.service';
import { RegisterService } from './providers/register.service';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { VerifyService } from './providers/verify.service';
import { ResetPasswordService } from './providers/reset-password.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from '../shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyAccountComponent,
    ResetPasswordComponent,
  ],
  imports: [
    // Angular
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,

    // Angular Material
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,

    // Gaushadhi
    SharedModule,
  ],
  providers: [
    LoginService,
    RegisterService,
    VerifyService,
    ResetPasswordService,
  ],
})
export class AuthModule {}
