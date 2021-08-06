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
import {Subject} from 'rxjs';
import {TablePlayer} from "./shared/model";

export interface ToastrMessage {
  className: string;
  header?: string;
  key: string;
  parameters?: any;
  delay: number;
  autohide: boolean;
  player?: TablePlayer;
  user?: {
    id: string;
    username: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  messages = new Subject<ToastrMessage>();

  constructor() {
  }

  error(key: string, parameters?: any) {
    this.messages.next({className: 'bg-danger text-light', key, parameters, delay: 3000, autohide: true});
  }

  inGameEvent(key: string, parameters: any, player: TablePlayer, user?: { id: string; username: string }) {
    this.messages.next({
      className: 'bg-info text-light',
      key,
      parameters,
      delay: 2000,
      autohide: true,
      player,
      user
    });
  }

  info(key: string) {
    this.messages.next({
      className: 'bg-info text-light',
      key,
      parameters: null,
      delay: 2000,
      autohide: true
    });
  }
}
