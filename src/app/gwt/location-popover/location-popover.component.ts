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
import {Building, Location, Trail} from "../model";
import {Table} from "../../shared/model";

@Component({
  selector: 'gwt-location-popover',
  templateUrl: './location-popover.component.html',
  styleUrls: ['./location-popover.component.scss']
})
export class LocationPopoverComponent implements OnInit, OnChanges {

  @Input() table: Table;
  @Input() trail: Trail;
  @Input() name: string;
  @Input() risk = false;

  location?: Location;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.trail && this.name) {
      this.location = this.trail.locations[this.name];
    }
  }

}
