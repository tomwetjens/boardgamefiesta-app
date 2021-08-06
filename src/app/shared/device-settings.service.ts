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

import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

export interface DeviceSettings {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceSettingsService {

  _deviceSettings = new BehaviorSubject<DeviceSettings>({});

  constructor(@Inject('localStorage') private localStorage: Storage) {
    const item = localStorage.getItem('deviceSettings');
    this._deviceSettings.next(item ? JSON.parse(item) : {});
  }

  get deviceSettings(): Observable<DeviceSettings> {
    return this._deviceSettings.asObservable();
  }

  save() {
    this.localStorage.setItem('deviceSettings', JSON.stringify(this._deviceSettings.value));
  }
}
