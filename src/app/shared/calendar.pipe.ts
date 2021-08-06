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

import {Pipe, PipeTransform} from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'cal'
})
export class CalendarPipe implements PipeTransform {

  transform(value: Date | number | string): string {
    return moment(value).calendar(null, {
      // Only to override locale:
      // sameDay: 'LT',
      // lastDay: '[Yesterday at] LT',
      // lastWeek: '[last] dddd [at] LT',
      sameElse: 'LLLL' // Locale default does not include time
    });
  }

}
