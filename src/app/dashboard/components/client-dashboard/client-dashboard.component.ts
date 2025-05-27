import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {Router} from "@angular/router";
import IOrder from "../../../shared/models/IOrder";
import {OrderService} from "../../../order/services/order.service";
import { IProduct } from 'src/app/shared/models/IProduct';
import {StatsService} from "../../../order/services/stats.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
  providers: [StatsService, OrderService]
})
export class ClientDashboardComponent implements OnInit {
  orders: IOrder[] = [];
  mostFrequentProducts: IProduct[]=[];
  mostRecentProducts: IProduct[]=[];

  constructor(public as:AuthService,
              private os: OrderService,
              private ss: StatsService,
              private router: Router,
  ) { }

  ngOnInit(): void {
    this.os.getAllMyOrders().subscribe({
      next: orders=> this.orders = orders,
      error: err=> {
        this.orders = [];
        console.error(err)
      }
    });
    this.ss.getMostFrequentlyPurchasedProducts(3).subscribe({
      next: products => this.mostFrequentProducts = products,
      error: err => console.error(err)
    });
    this.ss.getMostRecentlyPurchasedProducts(3).subscribe({
      next: products => this.mostRecentProducts = products,
      error: err => console.error(err)
    });
  }

  handleLogout() {
    this.as.logout();
    this.router.navigate([''])
  }

  cancelOrder(orderId: number) {
    const isConfirmed = confirm('Are you sure you want to cancel this order?');
    if (!isConfirmed) {
      return;
    }

    this.os.cancelOrder(orderId).pipe(
      switchMap(() => this.os.getAllMyOrders())
    ).subscribe({
      next: orders => this.orders = orders,
      error: err => {
        this.orders = [];
        console.error(err);
      }
    });
  }
}
