import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {Router} from "@angular/router";
import {OrderService} from "../../../order/services/order.service";
import {StatsService} from "../../../order/services/stats.service";
import {IOrderInternal} from "../../../shared/models/IOrder";
import {IProduct, IProductInternal} from "../../../shared/models/IProduct";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  providers: [StatsService, OrderService]
})
export class AdminDashboardComponent implements OnInit {
  orders: IOrderInternal[] = [];
  mostProfitableProducts: IProductInternal[] = [];
  mostPopularProducts: IProductInternal[] = [];

  constructor(public as:AuthService,
              private os: OrderService,
              private ss: StatsService,
              private router: Router,) { }

  ngOnInit(): void {
    this.os.getAllOrders().subscribe({
      next: orders=> this.orders = orders,
      error: err=> {
        this.orders = [];
        console.error(err)
      }
    });

    this.ss.getMostPopularProducts(3).subscribe({
      next: products=> this.mostPopularProducts = products,
      error: err=> {
        this.mostPopularProducts = [];
        console.error(err)
      }
    });

    this.ss.getMostProfitableProducts(3).subscribe({
      next: products=> this.mostProfitableProducts = products,
      error: err=> {
        this.mostProfitableProducts = [];
        console.error(err)
      }
    });
  }

  handleLogout() {
    this.as.logout();
    this.router.navigate([''])
  }
}
