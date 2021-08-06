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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map, switchMap, takeUntil} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {User} from "../../shared/model";
import {UserService} from "../../user.service";
import {TitleService} from "../../title.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();

  username$: Observable<string>;
  user$: Observable<User>;
  currentUser$: Observable<User>;

  constructor(
    private route: ActivatedRoute,
    private titleService: TitleService,
    private userService: UserService) {
  }

  ngOnInit(): void {
    this.username$ = this.route.params.pipe(map(({username}) => username));

    this.currentUser$ = this.userService.currentUser;

    this.user$ = this.username$.pipe(
      switchMap(username => this.userService.get(username)),
      takeUntil(this.destroyed));

    this.user$.subscribe(user => this.titleService.setTitle(user.username));
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

}
