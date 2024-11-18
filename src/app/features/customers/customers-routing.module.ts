import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './pages/customers/customers.component';
import { CustomerProfileComponent } from './pages/customer-profile/customer-profile.component';

const routes: Routes = [
  {path:'', component: CustomersComponent},
  {path: ':id/profile', component: CustomerProfileComponent },
  {path: '', redirectTo: '/customers', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
