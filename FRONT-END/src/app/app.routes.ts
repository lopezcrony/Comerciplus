import { Routes } from '@angular/router';
import { ProvidersComponent } from './modules/providers/providers.component';
import { LayoutComponent } from './layout/main-layout/layout.component';
import { ClientsComponent } from './modules/clients/clients.component';
import { LossComponent } from './modules/loss/loss.component';
import { CategoriesComponent } from './modules/categories/categories.component';
import { ProductsComponent } from './modules/products/products.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'providers', component: ProvidersComponent },
      { path: 'clients', component: ClientsComponent},
      { path: 'loss', component: LossComponent},


      { path: 'categories', component: CategoriesComponent},
      { path: 'products', component: ProductsComponent},
      { path: '', redirectTo: 'crud', pathMatch: 'full' },
    ]
  }
];
