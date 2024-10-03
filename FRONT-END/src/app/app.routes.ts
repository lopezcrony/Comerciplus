import { Routes } from '@angular/router';
import { UsersComponent } from './modules/users/users.component';
import { ProvidersComponent } from './modules/providers/providers.component';
import { LayoutComponent } from './layout/main-layout/layout.component';
import { ClientsComponent } from './modules/clients/clients.component';
import { LossComponent } from './modules/loss/loss.component';
import { CategoriesComponent } from './modules/categories/categories.component';
import { ProductsComponent } from './modules/products/products.component';
import { RolesComponent } from './modules/roles/roles.component';
import { SalesComponent} from './modules/sales/sales.component'
import { ReturnProviderComponent} from './modules/return-provider/return-provider.component'
import { ReturnSaleComponent } from './modules/return-sale/return-sale.component';
import { CreditsComponent } from './modules/credits/credits.component';
import { ShoppingsComponent } from './modules/shoppings/shoppings.component';
import { LoginComponent } from './auth/login/login.component';
import { ShoppinviewComponent } from './modules/shoppinview/shoppinview.component';
import { RecoverComponent } from './auth/recover/recover.component';
import { RestoreComponent } from './auth/restore/restore.component';
import { DetailSaleComponent } from './modules/detailSale/detail-sale.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recover', component: RecoverComponent},
  { path: 'restore', component: RestoreComponent},
  {
    path: '',
    component: LayoutComponent,
    children: [
      
      { path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
      { path: 'roles', component: RolesComponent, canActivate: [AuthGuard] },
      { path: 'providers', component: ProvidersComponent, canActivate: [AuthGuard] },
      { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
      { path: 'loss', component: LossComponent, canActivate: [AuthGuard] },
      { path: 'sales', component: SalesComponent, canActivate: [AuthGuard]},
      { path: 'returProvider', component: ReturnProviderComponent, canActivate: [AuthGuard]},
      { path: 'returnSale', component: ReturnSaleComponent, canActivate: [AuthGuard]},
      { path: 'credits', component: CreditsComponent, canActivate: [AuthGuard]},
      { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard]},
      { path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
      { path: 'shoppings', component: ShoppingsComponent, canActivate: [AuthGuard]},
      { path: 'shoppingview', component: ShoppinviewComponent, canActivate: [AuthGuard]},
      { path: 'detailSales', component: DetailSaleComponent, canActivate: [AuthGuard]},

      { path: '', redirectTo: 'crud', pathMatch: 'full' },
    ]
  }
];
