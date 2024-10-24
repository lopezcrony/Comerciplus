import { Routes } from '@angular/router';
import { UsersComponent } from './modules/users/users.component';
import { ProvidersComponent } from './modules/providers/providers.component';
import { LayoutComponent } from './layout/main-layout/layout.component';
import { ClientsComponent } from './modules/clients/clients.component';
import { LossComponent } from './modules/loss/loss.component';
import { CategoriesComponent } from './modules/categories/categories.component';
import { ProductsComponent } from './modules/products/products.component';
import { RolesComponent } from './modules/roles/roles.component';
import { SalesComponent} from './modules/sales/sales.component';
import { ReturnProviderComponent} from './modules/return-provider/return-provider.component';
import { ReturnSaleComponent } from './modules/return-sale/return-sale.component';
import { CreditsComponent } from './modules/credits/credits.component';
import { ShoppingsComponent } from './modules/shoppings/shoppings.component';
import { LoginComponent } from './auth/login/login.component';
import { ShoppinviewComponent } from './modules/shoppinview/shoppinview.component';
import { RecoverComponent } from './auth/recover/recover.component';
import { RestoreComponent } from './auth/restore/restore.component';
import { DetailSaleComponent } from './modules/detailSale/detail-sale.component';
import { AuthGuard } from './auth/auth.guard';
import { LoadingComponent } from './shared/loading/loading.component';

export const routes: Routes = [
  { path: 'loading', component: LoadingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recover', component: RecoverComponent },
  { path: 'restore', component: RestoreComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'providers', component: ProvidersComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'loss', component: LossComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'returnProvider', component: ReturnProviderComponent },
      { path: 'returnSale', component: ReturnSaleComponent },
      { path: 'credits', component: CreditsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'shoppings', component: ShoppingsComponent },
      { path: 'shoppingview', component: ShoppinviewComponent },
      { path: 'detailSales', component: DetailSaleComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ]
  },
];
