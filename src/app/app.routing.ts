import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { SessionsComponent } from './shared/components/sessions/sessions.component';
import { AuthGuard } from './shared/services/auth/auth.guard';

export const rootRouterConfig: Routes = [
  { path: 'customers', component: AdminLayoutComponent, canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./views/customers/customer.module').then(m => m.CustomerModule),
        data: { title: 'Customers', breadcrumb: 'customers' },
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: 'auth',
    children: [
      {
        path: '',
        loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule),
        data: { title: 'Authentication', breadcrumb: 'Authentication' },
      }
    ]
  },
  { path:"", redirectTo: "auth/signIn", pathMatch: 'full' },
  { path: 'sessions/404', component: SessionsComponent },
  { path: '**', redirectTo: 'sessions/404' }
];

