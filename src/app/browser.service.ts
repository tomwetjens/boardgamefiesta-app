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

import {Injectable} from '@angular/core';
import {combineLatest, fromEvent, Observable} from "rxjs";
import {distinctUntilChanged, map, shareReplay, startWith} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  private isVisible$ = fromEvent(document, 'visibilitychange')
    .pipe(
      map(x => document.visibilityState),
      startWith(document.visibilityState),
      map(visibilityState => visibilityState === 'visible'),
      distinctUntilChanged(),
      shareReplay(1)
    );

  constructor() {
  }

  get active(): Observable<boolean> {
    return this.isVisible$;
  }
}
