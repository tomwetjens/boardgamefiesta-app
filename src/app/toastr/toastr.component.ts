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

import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ToastrMessage, ToastrService} from '../toastr.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {fadeInOnEnterAnimation} from "angular-animations";

@Component({
  selector: 'app-toastr',
  animations: [
    fadeInOnEnterAnimation({duration: 500})
  ],
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss']
})
export class ToastrComponent implements OnInit, OnDestroy {

  toastrMessages: ToastrMessage[] = [];

  private destroyed = new Subject();

  constructor(private toastrService: ToastrService, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.toastrService.messages
      .pipe(
        takeUntil(this.destroyed)
        //  TODO debounce or distinct?
      )
      .subscribe(toastrMessage => {
        this.ngZone.run(() => this.toastrMessages.push(toastrMessage));
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  hide(msg: ToastrMessage) {
    const index = this.toastrMessages.indexOf(msg);
    this.toastrMessages.splice(index, 1);
  }
}
