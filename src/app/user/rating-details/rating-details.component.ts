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

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Rating, UserService} from "../../user.service";
import {Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'user-rating-details',
  templateUrl: './rating-details.component.html',
  styleUrls: ['./rating-details.component.scss']
})
export class RatingDetailsComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();

  @Input() userId: string;
  @Input() tableId: string;

  rating$: Observable<Rating>;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.rating$ = this.userService.getRating(this.userId, this.tableId)
      .pipe(takeUntil(this.destroyed));
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

}
