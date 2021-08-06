/*
 * Board Game Fiesta
 * Copyright (C)  2021 Tom Wetjens <tomwetjens@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
