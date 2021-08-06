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
import {Hazard} from "../model";

@Component({
  selector: 'gwt-hazard-popover',
  templateUrl: './hazard-popover.component.html',
  styleUrls: ['./hazard-popover.component.scss']
})
export class HazardPopoverComponent implements OnInit {

  @Input() hazard: Hazard;

  constructor() { }

  ngOnInit(): void {
  }

}
