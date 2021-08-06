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

import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {UserService} from "../../user.service";
import {Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Table, User} from "../../shared/model";

@Component({
  selector: 'user-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit, OnChanges, OnDestroy {

  @Input() user: User;

  private destroyed = new Subject();

  tables$: Observable<Table[]>;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userId) {
      this.refresh();
    }
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  private refresh() {
    this.tables$ = this.userService.getTables(this.user.id).pipe(
      takeUntil(this.destroyed));
  }

}
