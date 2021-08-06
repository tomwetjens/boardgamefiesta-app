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
import {GameProvider, Option} from "../shared/api";
import {TranslateService} from "@ngx-translate/core";
import {LogEntry, Table, TablePlayer, User} from "../shared/model";
import {LayoutType} from "./model";

@Injectable({
  providedIn: 'root'
})
export class BigBazarProvider implements GameProvider {

  getOptions(): Option[] {
    return [
      {
        key: 'layoutType',
        values: [LayoutType.SHORT_PATHS, LayoutType.LONG_PATHS, LayoutType.IN_ORDER, LayoutType.RANDOM],
        defaultValue: LayoutType.RANDOM
      }
    ];
  }

  constructor(private translateService: TranslateService) {
  }

  translate(logEntry: LogEntry, table: Table): string {
    return this.translateService.instant('big-bazar.log.' + logEntry.parameters[0],
      logEntry.parameters.reduce((interpolateObject, value, index) => {
        const type = logEntry.parameters[0];

        interpolateObject['value' + index] =
          (['MOVE', 'MOVE_SMUGGLER', 'MOVE_GOVERNOR', 'SEND_FAMILY_MEMBER'].includes(type) && index == 1)
          || (type === 'MOVE_DUMMY' && index === 2) ? this.translateService.instant('big-bazar.places.' + value)
            : type === 'CATCH_FAMILY_MEMBER' && index == 1 ? this.translatePlayer(table.players[value])
            : type === 'PAY_OTHER_PLAYER' && index == 2 ? this.translatePlayer(table.players[value])
            : this.translateValue(value);
        return interpolateObject;
      }, {}));
  }

  private translateValue(value: string) {
    const key = 'big-bazar.log.value.' + value;
    const result = this.translateService.instant(key);
    return result !== key ? result : value;
  }

  private translatePlayer(player: TablePlayer): string {
    return player.user
      ? this.translateUser(player.user)
      : this.translateService.instant('computer');
  }

  private translateUser(user: User) {
    return user.username;
  }
}
