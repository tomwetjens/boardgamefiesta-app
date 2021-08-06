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

import {ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject, Subscription, timer} from 'rxjs';
import moment from 'moment';

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

  @Input() end: string;

  private timer: Subscription;

  hours: number;
  minutes: number;
  seconds: number;

  ngOnInit(): void {
    this.timer = timer(0, 1000)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => this.ngZone.run(() => {
        const now = moment();
        if (now.isBefore(this.end)) {
          const duration = moment.duration(now.diff(moment(this.end)));
          this.hours = -duration.hours();
          this.minutes = -duration.minutes();
          this.seconds = Math.abs(duration.seconds());
        } else {
          this.hours = 0;
          this.minutes = 0;
          this.seconds = 0;
        }
      }));
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

}
