import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomersComponent } from './pages/customers/customers.component';
import { CustomerModalComponent } from './components/customer-modal/customer-modal.component';
import { CustomerProfileComponent } from './pages/customer-profile/customer-profile.component';
import { AddressesModalComponent } from './components/add-address-modal/addresses-modal.component';


@NgModule({
  declarations: [
    CustomersComponent,
    CustomerModalComponent,
    CustomerProfileComponent,
    AddressesModalComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CustomersModule { }
