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
import {Player, Table, TablePlayer} from '../model';

@Component({
  selector: 'app-in-game-player',
  templateUrl: './in-game-player.component.html',
  styleUrls: ['./in-game-player.component.scss']
})
export class InGamePlayerComponent implements OnInit {

  @Input() table: Table;
  @Input() player: TablePlayer;

  @Input() score?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
