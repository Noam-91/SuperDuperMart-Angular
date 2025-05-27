import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from "../../../cart/services/cart.service";
import ICart from "../../../shared/models/ICart";
import {AuthService} from "../../../auth/services/auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cart: ICart | null = null;
  isLoggedIn$ = this.as.isLoggedIn$;
  userRole$ = this.as.userRole$;
  subscription: Subscription | null = null;

  constructor(private cs: CartService,
              public as: AuthService,
              private router: Router) {  }

  ngOnInit(): void {
    this.cs.getCart().subscribe();
    this.subscription = this.cs.cart$.subscribe({
      next: value => {
        this.cart = value
      }
    })

    this.as.checkLogin();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  handleClick(){
    this.userRole$.subscribe(userRole=>{
      if(userRole === "ANONYMOUS"){
        alert("Please login first");
      }else{
        this.router.navigate(['/cart']);
      }
    });
  }
}
