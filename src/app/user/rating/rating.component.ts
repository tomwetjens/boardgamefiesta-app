import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map, switchMap, tap} from "rxjs/operators";
import {Rating, UserService} from "../../user.service";
import {combineLatest, Observable} from "rxjs";
import {User} from "../../shared/model";

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

  constructor(private route: ActivatedRoute,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.userId$ = this.route.params.pipe(
      map(({userId}) => userId));

    this.gameId$ = this.route.queryParams.pipe(
      map(({game}) => game));

    this.user$ = this.userId$.pipe(
      switchMap(userId => this.userService.get(userId)));

    this.ratings$ = combineLatest([this.gameId$, this.userId$]).pipe(
      switchMap(([gameId, userId]) => this.userService.getRatings(gameId, userId)));
  }

}
