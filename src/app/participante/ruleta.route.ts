import { Routes } from '@angular/router';
import RuletaComponent from './components/ruleta/ruleta.component';
import LayoutParticipanteComponent from './layout/layoutParticipante/layoutParticipante.component';

export const ruleta: Routes = [
  {
    path: '',
    component: LayoutParticipanteComponent,
    children: [
      {
        path: 'ruleta',
        component: RuletaComponent,
      },
      {
        path: '**',
        redirectTo: 'ruleta',
      },
    ],
  },
];

export default ruleta;
