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

  userId$: Observable<string>;
  gameId$: Observable<string>;

  user$: Observable<User>;
  ratings$: Observable<Rating[]>;

  chartData$: Observable<any>;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.userId$ = this.route.params.pipe(
      map(({userId}) => userId));

    this.gameId$ = this.route.queryParams.pipe(
      map(({game}) => game));

    this.user$ = this.userId$.pipe(
      switchMap(userId => this.userService.get(userId)));

    this.ratings$ = combineLatest([this.gameId$, this.userId$]).pipe(
      switchMap(([gameId, userId]) => this.userService.getRatings(gameId, userId)),
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
