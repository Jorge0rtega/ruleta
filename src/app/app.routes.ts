import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'participante',
    loadChildren: () => import('./participante/ruleta.route'),
  },
  {
    path: 'admin',
    loadChildren: () => import('./dashboard/dashboard.route'),
  },
  {
    path: '**',
    redirectTo: 'participante',
  },
];
