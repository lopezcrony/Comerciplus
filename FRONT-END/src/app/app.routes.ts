import { Routes } from '@angular/router';
import { UsersComponent } from './modules/users/users.component';
import { ProvidersComponent } from './modules/providers/providers.component';
import { LayoutComponent } from './layout/main-layout/layout.component';
import { ClientsComponent } from './modules/clients/clients.component';
import { LossComponent } from './modules/loss/loss.component';
import { CategoriesComponent } from './modules/categories/categories.component';
import { ProductsComponent } from './modules/products/products.component';
import { RolesComponent } from './modules/roles/roles.component';
import {SalesComponent} from './modules/sales/sales.component'
import {ReturnProviderComponent} from './modules/return-provider/return-provider.component'
import { ReturnSaleComponent } from './modules/return-sale/return-sale.component';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'providers', component: ProvidersComponent },
      { path: 'clients', component: ClientsComponent},
      { path: 'loss', component: LossComponent},
      { path: 'sales', component: SalesComponent},
      { path: 'returProvider', component: ReturnProviderComponent},
      {path: 'returnSale', component: ReturnSaleComponent},




      { path: 'categories', component: CategoriesComponent},
      { path: 'products', component: ProductsComponent},
      { path: '', redirectTo: 'crud', pathMatch: 'full' },
    ]
  }
];
