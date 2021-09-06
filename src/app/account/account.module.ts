import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { routes } from './account.routes';
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
import {
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import {AddressCardModule} from "../custom/components/address-card/address-card.module";
import {AddressFormModule} from "../custom/components/address-form/address-form.module";
import {ConfirmInputModule} from "../custom/components/confirm-input/confirm-input.module";
import {FormatPriceModule} from "../custom/pipes/format-price/format-price.module";

@NgModule({
  declarations: [
    SidebarComponent,
    OrderListComponent,
    OrderDetailsComponent,
    ProfileComponent,
    AddressComponent,
    ChangeEmailAddressComponent,
    ChangePasswordComponent,
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
        AddressCardModule,
        AddressFormModule,
        MatDialogModule,

        ConfirmInputModule,
        FormatPriceModule
    ],
  // providers: [
  //   {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
  //   {provide: MAT_DIALOG_DATA, useValue: {}}
  // ]
})
export class AccountModule {}
