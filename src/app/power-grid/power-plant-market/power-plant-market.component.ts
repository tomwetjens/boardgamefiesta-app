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
import {PowerPlant, PowerPlantMarket} from "../model";

@Component({
  selector: 'power-grid-power-plant-market',
  templateUrl: './power-plant-market.component.html',
  styleUrls: ['./power-plant-market.component.scss']
})
export class PowerPlantMarketComponent implements OnInit {

  @Input() powerPlantMarket: PowerPlantMarket;
  @Input() selectable: boolean;

  @Output() selectPowerPlant = new EventEmitter<PowerPlant>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
