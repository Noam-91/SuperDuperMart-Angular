import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, of, Subject, tap} from "rxjs";
import IWatchlist from "../../shared/models/IWatchlist";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  watchlistCollectionSubject:Subject<IWatchlist[]> = new BehaviorSubject<IWatchlist[]>([]);
  watchlistCollection$ = this.watchlistCollectionSubject.asObservable();
  constructor(private http: HttpClient) { }

  getAllWatchlists():Observable<IWatchlist[]>{
    return this.http.get<IWatchlist[]>(`${environment.apiUrl}/watchlist/all`, {withCredentials:true})
      .pipe(
        tap(watchlist => {
          this.watchlistCollectionSubject.next(watchlist);
        }),
        catchError(err => {
          //rollback
          console.error("get all watchlist failed")
          return of([] as IWatchlist[])
        })
      );
  }

  getWatchlistById(id:number):Observable<IWatchlist>{
    return this.http.get<IWatchlist>(`${environment.apiUrl}/watchlist/${id}`, {withCredentials:true});
  }

  createWatchlist(name:string):Observable<void>{
    return this.http.post<void>(`${environment.apiUrl}/watchlist/create?name=${name}`, null, {withCredentials:true});
  }
  deleteWatchlist(watchlistId:string):Observable<void>{
    return this.http.delete<void>(`${environment.apiUrl}/watchlist/delete/${watchlistId}`, {withCredentials:true});
  }

  addProductToWatchlist(watchlistId:number, productId:number):Observable<void>{
    return this.http.post<void>(`${environment.apiUrl}/watchlist/${watchlistId}/add/${productId}`, null, {withCredentials:true});
  }

  removeProductFromWatchlist(watchlistId:number, productId:number):Observable<void>{
    return this.http.delete<void>(`${environment.apiUrl}/watchlist/${watchlistId}/remove/${productId}`, {withCredentials:true});
  }
}
