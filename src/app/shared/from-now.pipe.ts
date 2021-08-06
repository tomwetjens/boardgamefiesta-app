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

import {ChangeDetectorRef, NgZone, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import moment from 'moment';
import {Subject, Subscription, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Pipe({name: 'fromNow', pure: false})
export class FromNowPipe implements PipeTransform, OnDestroy {

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

      const m = moment(value);
      const now = moment();
      return (now.isAfter(m, 'seconds') ? '-' : '') + m.fromNow(true);
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
