import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../auth/services/auth.service";
import {OrderService} from "../../services/order.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {IOrderInternal} from "../../../shared/models/IOrder";
import {Subscription, switchMap} from "rxjs";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  order: IOrderInternal | null = null;
  userRole: string = "ANONYMOUS";
  userRoleSubscription: Subscription | null = null;

  constructor(private route: ActivatedRoute,
              private as: AuthService,
              private os: OrderService,
              public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userRoleSubscription = this.as.userRole$.subscribe(
      userRole => {
        this.userRole = userRole;
      }
    );
    this.route.paramMap.subscribe(params => {
      const orderId = Number(params.get('orderId'));
      if (this.userRole === "ADMIN") {
        this.os.getOrderByIdInternal(orderId).subscribe({
          next: order => {
            this.order = order;
          },
          error: err => {
            console.error(err);
            this.order = null;
            this.snackBar.open('Failed to load order details.', 'Close', {
              duration: 3000,
            });
          }
        });
      } else {
        this.os.getOrderById(orderId).subscribe({
          next: order => {
            this.order = order as IOrderInternal;
          },
          error: err => {
            console.error(err);
            this.order = null;
            this.snackBar.open('Failed to load order details.', 'Close', {
              duration: 3000,
            });
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.userRoleSubscription?.unsubscribe();
  }

  cancelOrder(): void {
    const snackBarRef = this.snackBar.open("Cancelling order", "Undo",
      {duration:2000,
        horizontalPosition: "center",
        verticalPosition:"top"});
    const timeout = setTimeout(()=>{
      if (this.order) {
        this.os.cancelOrder(this.order.orderId)
          .pipe(
            switchMap(() => this.os.getOrderByIdInternal(this.order!.orderId))
          )
          .subscribe({
          next: (order) => {
            this.order = order;
          },
          error: err => {
            console.error(err);
          }
        });
      }
    }, 2200)
    snackBarRef.onAction().subscribe(() => {
      clearTimeout(timeout);
    });
  }

  completeOrder(): void {
    const snackBarRef = this.snackBar.open("Completing order", "Undo",
      {duration:2000,
        horizontalPosition: "center",
        verticalPosition:"top"});
    const timeout = setTimeout(()=>{
      if (this.order) {
        this.os.completeOrder(this.order.orderId)
          .pipe(
            switchMap(() => this.os.getOrderByIdInternal(this.order!.orderId))
          )
          .subscribe({
          next: (order) => {
            this.order = order;
          },
          error: err => {
            console.error(err);
          }
        });
      }
    }, 2200)
    snackBarRef.onAction().subscribe(() => {
      clearTimeout(timeout);
    });
  }

}
