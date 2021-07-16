import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { routes } from './account.routes';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddressComponent } from './components/address/address.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChangeEmailAddressComponent } from './components/change-email-address/change-email-address.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    SidebarComponent,
    DashboardComponent,
    OrderListComponent,
    OrderDetailsComponent,
    ProfileComponent,
    AddressComponent,
    ChangeEmailAddressComponent,
  ],
  imports: [
    // Angular
    CommonModule,
    RouterModule.forChild(routes),

    // Angular Material
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    SharedModule,
  ],
})
export class AccountModule {}
