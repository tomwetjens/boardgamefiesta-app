import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserService} from './user.service';
import {Observable} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.isLoggedIn().pipe(
      switchMap(loggedIn => {
        if (!loggedIn) {
          this.userService.login();
        }
        return this.userService.currentUser;
      }),
      take(1),
      map(user => !!user));
  }

}
