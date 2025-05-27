import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IProduct, IProductInternal} from 'src/app/shared/models/IProduct';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private http:HttpClient) { }

  getMostFrequentlyPurchasedProducts(limit:number):Observable<IProduct[]>{
    return this.http.get<IProduct[]>(`${environment.apiUrl}/stats/frequent/${limit}`, {withCredentials:true});
  }

  getMostRecentlyPurchasedProducts(limit:number):Observable<IProduct[]>{
    return this.http.get<IProduct[]>(`${environment.apiUrl}/stats/recent/${limit}`, {withCredentials:true});
  }

  getMostProfitableProducts(limit:number):Observable<IProductInternal[]>{
    return this.http.get<IProductInternal[]>(`${environment.apiUrl}/stats/profit/${limit}`, {withCredentials:true});
  }
  getMostPopularProducts(limit:number):Observable<IProductInternal[]>{
    return this.http.get<IProductInternal[]>(`${environment.apiUrl}/stats/popular/${limit}`, {withCredentials:true});
  }
}
