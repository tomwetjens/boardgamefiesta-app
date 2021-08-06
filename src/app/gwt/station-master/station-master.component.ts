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

import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {StationMaster} from '../model';

@Component({
  selector: 'app-station-master',
  templateUrl: './station-master.component.html',
  styleUrls: ['./station-master.component.scss']
})
export class StationMasterComponent implements OnInit {

  @Input() stationMaster: StationMaster;

  constructor() {
  }

  ngOnInit(): void {
  }

}
