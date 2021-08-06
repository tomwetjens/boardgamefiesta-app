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

import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Table, TablePlayer} from "../../shared/model";
import {BigBazar, PlayerState} from "../model";

interface Column {
  player: TablePlayer;
  playerState: PlayerState;
}

@Component({
  selector: 'big-bazar-ended-dialog',
  templateUrl: './ended-dialog.component.html',
  styleUrls: ['./ended-dialog.component.scss']
})
export class EndedDialogComponent implements OnInit {

  @Input() table: Table;
  @Input() state: BigBazar;

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  get columns(): Column[] {
    return [this.table.player, ...this.table.otherPlayers]
      .filter(playerId => !!playerId)
      .map(playerId => this.table.players[playerId])
      .map(player => ({
        player,
        playerState: this.state.players[player.color]
      }));
  }

}
