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

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {User} from '../shared/model';
import {UserService} from '../user.service';
import {ReplaySubject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.scss']
})
export class SelectUserComponent implements OnInit {

  text: string;
  searching: boolean;
  users = new ReplaySubject<User[]>();

  constructor(public ngbActiveModal: NgbActiveModal,
              private userService: UserService) {
  }

  ngOnInit(): void {

  }

  search() {
    if (this.searching) {
      return;
    }

    this.searching = true;

    this.userService.find(this.text)
      .pipe(tap(() => this.searching = false))
      .subscribe(users => this.users.next(users));
  }

}
