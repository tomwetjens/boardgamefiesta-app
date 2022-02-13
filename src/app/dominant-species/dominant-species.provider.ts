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
import {LogEntry, PlayerType, Table, TablePlayer, User} from "../shared/model";

@Injectable({
  providedIn: 'root'
})
export class DominantSpeciesProvider implements GameProvider {

  getOptions(table: Table): Option[] {
    const options: Option[] = [
    ];


    return options;
  }

  constructor(private translateService: TranslateService) {
  }

  translate(logEntry: LogEntry, table: Table): string {
    return logEntry.parameters[0] === 'ACTION'
      ? this.translateService.instant(table.game + '.log.action.' + logEntry.parameters[1], this.toInterpolateParams(logEntry.parameters.slice(2), table))
      : this.translateService.instant(table.game + '.log.' + logEntry.parameters[0], this.toInterpolateParams(logEntry.parameters.slice(1), table))
  }

  private toInterpolateParams(values: any[], table: Table) {
    return values.reduce((ctx, value, index) => {
      return {
        ...ctx,
        ['value' + (index + 1)]: this.translateValue(value, table)
      };
    }, {});
  }

  private translateValue(value: string, table: Table): string {
    const player = table.players[value];

    if (player) {
      return this.translatePlayer(player);
    }

    const key = table.game + '.log.values.' + value;
    const translated = this.translateService.instant(key);
    return translated !== key ? translated : value;
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
