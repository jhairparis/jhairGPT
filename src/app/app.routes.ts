import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared//components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/chat/chat.module').then((m) => m.HomeModule),
  },
  { path: '**', component: PageNotFoundComponent },
];
