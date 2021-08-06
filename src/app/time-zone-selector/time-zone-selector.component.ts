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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import moment from "moment-timezone";

@Component({
  selector: 'app-time-zone-selector',
  templateUrl: './time-zone-selector.component.html',
  styleUrls: ['./time-zone-selector.component.scss']
})
export class TimeZoneSelectorComponent implements OnInit {

  @Input() value?: string;

  @Output() changeTimeZone = new EventEmitter<string>();

  timeZones: string[];

  constructor() {
  }

  ngOnInit(): void {
    this.timeZones = moment.tz.names()
      .filter(name => !name.startsWith('Etc/')) // Exclude 'Etc/GMT+1 etc.
      .filter(name => name.includes('/')); // Exclude 'GB', 'GMT', etc.
  }

}
