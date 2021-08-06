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
import {LogEntry, Table} from "../shared/model";

@Injectable({
  providedIn: 'root'
})
export class PowerGridProvider implements GameProvider {

  getOptions(): Option[] {
    return [];
  }

  constructor(private translateService: TranslateService) {
  }

  translate(logEntry: LogEntry, table: Table): string {
    return this.translateService.instant('power-grid.log.' + logEntry.parameters[0]);
  }

}
