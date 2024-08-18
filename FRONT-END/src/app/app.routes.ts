import { Routes } from '@angular/router';
import { ProvidersComponent } from './modules/providers/providers.component';
import { LayoutComponent } from './layout/main-layout/layout.component';
import { ClientsComponent } from './modules/clients/clients.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'providers', component: ProvidersComponent },
      { path: 'clients', component: ClientsComponent},

      { path: '', redirectTo: 'crud', pathMatch: 'full' },
    ]
  }
];
