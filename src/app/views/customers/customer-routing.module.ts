import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/shared/services/auth/auth.guard';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { CustomerComponent } from './components/customer/customer.component';


const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
    data: {title: 'Customers', breadcrumb: 'Customer Management'},
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:customerId',
    component: CustomerFormComponent,
    data: {title: 'Customers', breadcrumb: 'Edit Customer'},
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
