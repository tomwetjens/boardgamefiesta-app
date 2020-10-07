import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../user.service";
import {Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Table, User} from "../../shared/model";

@Component({
  selector: 'user-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit, OnDestroy {

  @Input() userId: string;

  private destroyed = new Subject();

  tables$: Observable<Table[]>;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.tables$ = this.userService.getTables(this.userId).pipe(
      takeUntil(this.destroyed));
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

}
