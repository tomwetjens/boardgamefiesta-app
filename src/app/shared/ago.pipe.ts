import {ChangeDetectorRef, NgZone, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import moment from 'moment';
import {Subject, Subscription, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Pipe({name: 'ago', pure: false})
export class AgoPipe implements PipeTransform, OnDestroy {

  private destroyed = new Subject();

  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone) {

  }

  private timer: Subscription;

  transform(value: string, autoUpdatePeriod: number = 5000): unknown {
    if (value) {
      if (!this.timer) {
        this.timer = timer(0, autoUpdatePeriod)
          .pipe(takeUntil(this.destroyed))
          .subscribe(() => this.ngZone.run(() => this.cdRef.markForCheck()));
      }
      return moment(value).fromNow(true);
    } else {
      if (this.timer) {
        this.timer.unsubscribe();
      }
    }
    return value;
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

}
