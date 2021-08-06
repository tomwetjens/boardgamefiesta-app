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

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Table} from "../../shared/model";
import {Action, ActionType, PowerGrid, PowerPlant} from "../model";

@Component({
  selector: 'power-grid-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnChanges {

  @Input() state: PowerGrid;
  @Input() table: Table;
  @Input() selectedAction: ActionType;

  @Output() perform = new EventEmitter<Action>();

  @Output() selectedActionChange = new EventEmitter<ActionType>();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.state.actions && this.state.actions.length === 1) {
      this.selectedAction = this.state.actions[0];
    } else {
      this.selectedAction = null;
    }
    this.selectedActionChange.emit(this.selectedAction);
  }

  selectPowerPlant(powerPlant: PowerPlant) {
    if (this.selectedAction === ActionType.START_AUCTION) {
      this.perform.emit({type: ActionType.START_AUCTION, powerPlant: powerPlant.name});
    }
  }
}
