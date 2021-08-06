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
import {Action, ActionType, State, StationMaster} from "../model";

@Component({
  selector: 'gwt-bonus-station-masters',
  templateUrl: './bonus-station-masters.component.html',
  styleUrls: ['./bonus-station-masters.component.scss']
})
export class BonusStationMastersComponent implements OnInit {

  @Input() state: State;
  @Input() selectedAction: ActionType;

  @Output() perform = new EventEmitter<Action>();

  constructor() {
  }

  ngOnInit(): void {
  }

  canSelect(stationMaster: StationMaster) {
    return this.selectedAction === ActionType.TAKE_BONUS_STATION_MASTER;
  }

  selectStationMaster(stationMaster: StationMaster) {
    this.perform.emit({type: ActionType.TAKE_BONUS_STATION_MASTER, stationMaster});
  }
}
