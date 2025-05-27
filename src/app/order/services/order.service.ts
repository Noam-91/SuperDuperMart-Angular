import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import IOrder, {IOrderInternal} from "../../shared/models/IOrder";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http:HttpClient) { }

  getAllMyOrders():Observable<IOrder[]>{
    return this.http.get<IOrder[]>(`${environment.apiUrl}/orders/all`, {withCredentials:true});
  }

  getOrderById(id:number):Observable<IOrder>{
    return this.http.get<IOrder>(`${environment.apiUrl}/orders/${id}`, {withCredentials:true});
  }

  cancelOrder(id:number):Observable<void>{
    return this.http.patch<void>(`${environment.apiUrl}/orders/${id}/cancel`, null, {withCredentials:true});
  }

  /** Internal api */
  completeOrder(id:number):Observable<void>{
    return this.http.patch<void>(`${environment.apiUrl}/orders/${id}/complete`, null, {withCredentials:true});
  }

  /** Internal api */
  getAllOrders():Observable<IOrderInternal[]>{
    return this.http.get<IOrderInternal[]>(`${environment.apiUrl}/internal/orders/all`, {withCredentials:true});
  }

  /** Internal api */
  getOrderByIdInternal(id:number):Observable<IOrderInternal>{
    return this.http.get<IOrderInternal>(`${environment.apiUrl}/internal/orders/${id}`, {withCredentials:true});
  }
}
