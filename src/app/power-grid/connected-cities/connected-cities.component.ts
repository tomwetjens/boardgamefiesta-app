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

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PowerGrid} from "../model";
import {Table} from "../../shared/model";

function frequency<T>(array: T[]): Map<T, number> {
  return array.reduce((counts, elem) => {
    counts.set(elem, (counts.get(elem) || 0) + 1);
    return counts;
  }, new Map<T, number>());
}

@Component({
  selector: 'power-grid-connected-cities',
  templateUrl: './connected-cities.component.html',
  styleUrls: ['./connected-cities.component.scss']
})
export class ConnectedCitiesComponent implements OnInit, OnChanges {

  @Input() state: PowerGrid;
  @Input() table: Table;

  connected: Map<string, number>;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.connected = frequency(
      Array.prototype.concat.apply(this.state.playerOrder, Object.keys(this.state.cities)
        .flatMap(city => this.state.cities[city])));
  }

}
