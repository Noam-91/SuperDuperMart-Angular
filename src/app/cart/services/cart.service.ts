import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, observable, Observable, of, Subject, tap} from "rxjs";
import ICart from "../../shared/models/ICart";
import {environment} from "../../../environments/environment";
import IMessageResponse from "../../shared/models/IMessageResponse";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartSubject:Subject<ICart|null> = new BehaviorSubject<ICart | null>(null);
  cart$ = this.cartSubject.asObservable();
  constructor(private http:HttpClient) { }

  getCart():Observable<ICart>{
    return this.http.get<ICart>(`${environment.apiUrl}/cart`,{withCredentials: true})
      .pipe(
        tap(cart => {
          this.cartSubject.next(cart);
        }),
        catchError(err => {
          //rollback
          console.error(err)
          this.cartSubject.next(null);
          return of(null as any)
        })
      )
  }

  /** Optimistic update:
   * Responsive to user interaction first,
   * then persist data to server */
  addProductToCart(productId: number, quantity:number):Observable<ICart>{
    return this.http.post<ICart>(`${environment.apiUrl}/cart/add?productId=${productId}&quantity=${quantity}`,
      null,{withCredentials: true}).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
      }),
      catchError(err => {
        //rollback
        console.error("add product to cart failed")
        this.getCart();
        return of(null as any)
      })
    );
  }

  /** Optimistic update:
   * Responsive to user interaction first,
   * then persist data to server */
  removeProductFromCart(productId: number):Observable<ICart>{
    return this.http.delete<ICart>(`${environment.apiUrl}/cart/remove?productId=${productId}`, {withCredentials: true})
      .pipe(
        tap(cart => {
          this.cartSubject.next(cart);
        }),
        catchError(err => {
          //rollback
          console.error("remove product from cart failed")
          this.getCart();
          return of(null as any)
        })
      )
  }


  /** Optimistic update:
   * Responsive to user interaction first,
   * then persist data to server */
  updateProductQuantity(cart:ICart):Observable<ICart>{
    //todo: test
    return this.http.patch<ICart>(`${environment.apiUrl}/cart/update`, cart,{withCredentials: true})
      .pipe(
        tap(cart => {
          console.log("update product qty successfully")
          this.cartSubject.next(cart);
        }),
        catchError(err => {
          //rollback
          console.error("update product qty in cart failed")
          this.getCart().subscribe();
          return of(null as any)
        })
    )
  }

  checkout(cart:ICart):Observable<IMessageResponse>{
    return this.http.post<IMessageResponse>(`${environment.apiUrl}/cart/purchase`, cart,{withCredentials: true})
      .pipe(
        tap(newCart => {
          this.getCart();
        })
      );
  }
}
