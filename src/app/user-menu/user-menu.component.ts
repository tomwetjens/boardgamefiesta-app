import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../shared/model';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  user: Observable<User>;
  loggedIn$: Observable<boolean>;

  constructor(private router: Router,
              private userService: UserService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.user = this.userService.currentUser;
    this.loggedIn$ = this.authService.loggedIn;
  }

  logout() {
    this.authService.logout();

    this.router.navigate(['/']);
  }

}
