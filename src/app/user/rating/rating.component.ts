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
import {ActivatedRoute} from "@angular/router";
import {map, shareReplay, switchMap} from "rxjs/operators";
import {Rating, UserService} from "../../user.service";
import {combineLatest, Observable} from "rxjs";
import {User} from "../../shared/model";
import moment from "moment";
import {DecimalPipe} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'user-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  username$: Observable<string>;
  gameId$: Observable<string>;

  user$: Observable<User>;
  ratings$: Observable<Rating[]>;

  chartData$: Observable<any>;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.username$ = this.route.params.pipe(
      map(({username}) => username));

    this.gameId$ = this.route.queryParams.pipe(
      map(({game}) => game));

    this.user$ = this.username$.pipe(
      switchMap(username => this.userService.get(username)));

    this.ratings$ = combineLatest([this.gameId$, this.user$]).pipe(
      switchMap(([gameId, user]) => this.userService.getRatings(gameId, user.id)),
      shareReplay(1));

    this.chartData$ = this.ratings$.pipe(
      map(ratings => [
        {
          name: 'Rating',
          series: ratings.map(rating => ({name: new Date(rating.timestamp), value: rating.rating}))
        }
      ]));
  }

  dateTickFormatting(val: any): string {
    if (val instanceof Date) {
      return moment(val).format('ll');
    }
  }

  get locale(): string {
    return this.translateService.currentLang;
  }

  numberTickFormatting(locale: string) {
    return val => new DecimalPipe(locale).transform(val);
  }

}
