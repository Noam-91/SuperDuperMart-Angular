import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "../services/auth.service";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean =>{
  const authService = inject(AuthService);
  let canActivate = false;

  authService.isLoggedIn$.subscribe({
    next: isLoggedIn =>{
      if(isLoggedIn
        || (!isLoggedIn && state.url === '/home')
        || (!isLoggedIn && state.url === '/products')
        || (!isLoggedIn && state.url === '/login')
        || (!isLoggedIn && state.url === '/register')
        || (!isLoggedIn && state.url === '/assistant')
      ){
        canActivate = true;
      }
    },
    error: err => {
      console.error(err);
      canActivate = false;
    }
  })

 return canActivate;
}
