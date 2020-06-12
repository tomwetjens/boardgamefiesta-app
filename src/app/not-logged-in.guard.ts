import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from "./user.service";
import {map, switchMap, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NotLoggedInGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.isLoggedIn().pipe(
      map(loggedIn => {
        if (loggedIn) {
          this.userService.initLoginFlow();
          return false;
        }
        return true;
      }),
      take(1));
  }

}
