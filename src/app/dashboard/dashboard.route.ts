import { Routes } from '@angular/router';
import { LayoutAdminComponent } from './layout/layoutAdmin/layoutAdmin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const dashBoard: Routes = [
  {
    path: '',
    component: LayoutAdminComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];

export default dashBoard;
