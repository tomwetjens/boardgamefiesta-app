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
import {Action, ActionType, State, Status} from "../model";

interface Row {
  position: number;
  cells: Cell[];
}

interface Cell {
  points: number;
  players: string[];
  selectable: boolean;
}

@Component({
  selector: 'gwt-bidding',
  templateUrl: './bidding.component.html',
  styleUrls: ['./bidding.component.scss']
})
export class BiddingComponent implements OnInit, OnChanges {

  @Input() table: Table;
  @Input() state: State;

  @Output() perform = new EventEmitter<Action>();

  columns: number[];
  rows: Row[];

  constructor() {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.state) {
      const playerCount = (!!this.state.currentPlayer ? 1 : 0) + this.state.otherPlayers.length;
      const max = this.state.bids
        .map(bid => bid.points || 0)
        .reduce((prev, cur) => Math.max(prev, cur), 0);

      this.columns = Array(Math.max(6, max + playerCount)).fill(null).map((_, index) => index);

      this.rows = Array(playerCount).fill(0)
        .map((_, position) => {
          const contesting = this.state.bids.filter(bid => bid.position == position);
          const min = Math.max(...contesting.map(bid => bid.points));

          return ({
            position,
            cells: this.columns.map(points => ({
              points,
              players: contesting.filter(bid => bid.points == points).map(bid => bid.player),
              selectable: points > min
            }))
          });
        });
    }
  }

  placeBid(position: number, cell: Cell) {
    if (!this.canSelectSpot(position, cell)) {
      return;
    }
    this.perform.emit({type: ActionType.PLACE_BID, position, points: cell.points});
  }

  canSelectSpot(position: number, cell: Cell): boolean {
    return this.state.turn && this.state.status === Status.BIDDING && cell.selectable;
  }
}
