import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/components/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RegisterComponent } from './auth/components/register/register.component';
import { LabellingPipe } from './shared/pipes/Labelling.pipe';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import {HttpClientModule} from "@angular/common/http";
import { CartComponent } from './cart/cart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import { ClientDashboardComponent } from './dashboard/components/client-dashboard/client-dashboard.component';
import { AdminDashboardComponent } from './dashboard/components/admin-dashboard/admin-dashboard.component';
import {MatDialogModule} from "@angular/material/dialog";
import {PaymentRedirectDialogComponent} from "./payment-redirect-dialog/payment-redirect-dialog.component";
import {MatButtonModule} from "@angular/material/button";
import { ProductDetailComponent } from './product/components/product-detail/product-detail.component';
import { WatchlistComponent } from './watchlist/components/watchlist/watchlist.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { CreateWatchlistDialogComponent } from './watchlist/components/create-watchlist-dialog-component/create-watchlist-dialog-component.component';
import {MatInputModule} from "@angular/material/input";
import { OrderComponent } from './order/components/order/order.component';
import { ProductEditComponent } from './product/components/product-edit/product-edit.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSelectModule} from "@angular/material/select";
import { AssistantChatComponent } from './assistant/components/assistant-chat/assistant-chat.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    LabellingPipe,
    HeaderComponent,
    FooterComponent,
    CartComponent,
    ClientDashboardComponent,
    AdminDashboardComponent,
    PaymentRedirectDialogComponent,
    ProductDetailComponent,
    WatchlistComponent,
    CreateWatchlistDialogComponent,
    OrderComponent,
    ProductEditComponent,
    AssistantChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
