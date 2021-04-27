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
