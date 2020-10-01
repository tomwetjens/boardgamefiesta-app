import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../user.service";
import {ActivatedRoute} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {map, switchMap, takeUntil} from "rxjs/operators";
import {Table, User} from "../../shared/model";

@Component({
  selector: 'user-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();

  userId$: Observable<string>;
  user$: Observable<User>;
  tables$: Observable<Table[]>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService) {
  }

  ngOnInit(): void {
    this.userId$ = this.route.params.pipe(map(({userId}) => userId));

    this.user$ = this.userId$.pipe(
      takeUntil(this.destroyed),
      switchMap(userId => this.userService.get(userId)));

    this.tables$ = this.userId$.pipe(
      takeUntil(this.destroyed),
      switchMap(userId => this.userService.getTables(userId)));
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

}
