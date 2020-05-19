import {ChangeDetectorRef, Component, DoCheck, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject, Subscription, timer} from 'rxjs';
import moment from "moment";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();
  constructor(private cdRef: ChangeDetectorRef,
              private ngZone: NgZone) {
  }

  @Input() date: string;

  private timer: Subscription;

  minutes: number;
  seconds: number;

  ngOnInit(): void {
    this.timer = timer(0, 1000)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => this.ngZone.run(() => {
        const diff = Math.min(0, moment().diff(moment(this.date)));
        const duration = moment.duration(diff);
        this.minutes = duration.minutes();
        this.seconds = Math.abs(duration.seconds());
      }));
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

}
