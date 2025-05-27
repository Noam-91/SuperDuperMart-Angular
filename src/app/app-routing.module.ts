import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./auth/components/login/login.component";
import {RegisterComponent} from "./auth/components/register/register.component";
import {CartComponent} from "./cart/cart.component";
import {authGuard} from "./auth/guards/auth.functional.guard";
import {ClientDashboardComponent} from "./dashboard/components/client-dashboard/client-dashboard.component";
import {AdminDashboardComponent} from "./dashboard/components/admin-dashboard/admin-dashboard.component";
import {ProductDetailComponent} from "./product/components/product-detail/product-detail.component";
import {WatchlistComponent} from "./watchlist/components/watchlist/watchlist.component";
import {OrderComponent} from "./order/components/order/order.component";
import {ProductEditComponent} from "./product/components/product-edit/product-edit.component";
import {AssistantChatComponent} from "./assistant/components/assistant-chat/assistant-chat.component";

const routes: Routes = [
  { path: '',
    title:'Super Duper Mart',
    component:HomeComponent
  },
  {
    path: 'login',
    title: 'Login | Super Duper Mart',
    component: LoginComponent,
    canActivate: [authGuard]
  },
  {
    path: 'register',
    title: 'Sign Up | Super Duper Mart',
    component: RegisterComponent,
    canActivate: [authGuard]
  },
  {
    path: 'cart',
    title: 'My Cart | SDM',
    component: CartComponent,
    canActivate: [authGuard]
  },
  {
    path: 'client-dashboard',
    title: 'Dashboard | SDM',
    component: ClientDashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin-dashboard',
    title: 'Dashboard | SDM',
    component: AdminDashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'product/:productId',
    title: 'Product | SDM',
    component: ProductDetailComponent
  },
  {
    path: 'product-edit/:productId',
    title: 'Edit Product | SDM',
    component: ProductEditComponent,
    canActivate: [authGuard]
  },
  {
    path: 'product-edit',
    title: 'New Product | SDM',
    component: ProductEditComponent,
    canActivate: [authGuard]
  },
  {
    path: 'watchlist',
    title: 'Watchlist | SDM',
    component: WatchlistComponent,
    canActivate: [authGuard]
  },
  {
    path: 'order/:orderId',
    title: 'Order | SDM',
    component: OrderComponent,
    canActivate: [authGuard]
  },
  {
    path: 'assistant',
    title: 'Assistant | SDM',
    component: AssistantChatComponent,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
