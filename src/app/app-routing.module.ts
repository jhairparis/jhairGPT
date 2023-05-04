import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'chat', component: DashboardComponent },
  /*   {
    path: 'food',
    component: MessagesComponent,
    title: 'First component',
    children: [
      {
        path: 'child-b',
        title: 'child b',
        component: ViewChatsComponent, // another child route component that the router renders
      },
    ],
  }, */
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
