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
