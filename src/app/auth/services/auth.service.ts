import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, of, Subject, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import IMessageResponse from "../../shared/models/IMessageResponse";
import {environment} from "../../../environments/environment";
import IUser, {IUserSimple, UserRole} from "../../shared/models/IUser";
import {CartService} from "../../cart/services/cart.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginSubject = new BehaviorSubject<boolean>(sessionStorage.getItem('isLoggedIn_SDM')==='true');
  isLoggedIn$ = this.loginSubject.asObservable();
  userRoleSubject = new BehaviorSubject<UserRole>
  (sessionStorage.getItem('role_SDM')?sessionStorage.getItem('role_SDM') as UserRole :"ANONYMOUS");
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private http:HttpClient,
              private cs: CartService) { }

  login(username:string, password:string):Observable<IMessageResponse>{
    return this.http
      .post<IMessageResponse>(`${environment.apiUrl}/users/login`,
        {username,password},{ withCredentials: true } )
      .pipe(
        tap(_=>{
          sessionStorage.setItem('isLoggedIn_SDM', 'true');
        })
      );
  }

  logout():void{
    this.http.post(`${environment.apiUrl}/logout`, {}, {withCredentials: true})
      .subscribe({
        next: () => {
          this.loginSubject.next(false);
          this.userRoleSubject.next("ANONYMOUS");
          this.cs.getCart().subscribe();
          sessionStorage.removeItem('isLoggedIn_SDM');
          sessionStorage.removeItem('role_SDM');
        }
      });
  }

  register(user: IUser):Observable<IMessageResponse>{
    return this.http
      .post<IMessageResponse>(`${environment.apiUrl}/users/register`, user,{ withCredentials: true });
  }

  checkLogin():void{
    this.http
      .get<IUserSimple>(`${environment.apiUrl}/auth-status`, {withCredentials: true})
      .pipe(
        tap((user: IUserSimple) => {
            this.loginSubject.next(true);
            sessionStorage.setItem('isLoggedIn_SDM', 'true');
            this.userRoleSubject.next(user.userRole as UserRole);
            sessionStorage.setItem('role_SDM', user.userRole);
          }
        ),
        catchError(error => {
          this.loginSubject.next(false);
          this.userRoleSubject.next("ANONYMOUS");
          sessionStorage.removeItem('role_SDM');
          sessionStorage.removeItem('isLoggedIn');
          return of(null as any);
        })
      ).subscribe();
  }


}
