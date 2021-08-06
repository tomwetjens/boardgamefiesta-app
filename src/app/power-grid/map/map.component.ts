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
import {Action, ActionType, City, PowerGrid} from "../model";
import {Table} from "../../shared/model";

interface CityDescr {
  x: number;
  y: number;
}

interface ConnectionDescr {
  from: City;
  to: City;
  cost: number;
}

interface MapDescr {
  url: string;
  width: number;
  height: number;
  cities: { [city in City]: CityDescr };
  connections: ConnectionDescr[];
}

const GERMANY: MapDescr = {
  url: '/assets/games/power-grid/maps/germany-base.svg',
  width: 797.71050,
  height: 1027.19150,
  cities: {
    "flensburg": {x: 287.62241, y: 27.095873},
    "kiel": {x: 328.15472, y: 92.492531},
    "lubeck": {x: 387.92642, y: 136.88335},
    "cukhaven": {x: 232.6161, y: 150.63843},
    "wilhelmshaven": {x: 178.6174, y: 192.13281},
    "bremen": {x: 245.95079, y: 251.8284},
    "hamburg": {x: 324.70844, y: 191.86055},
    "hannover": {x: 324.97861, y: 347.40009},
    "osnabrueck": {x: 185.36841, y: 334.40656},
    "muenster": {x: 140.65315, y: 395.62915},
    "kassel": {x: 284.83957, y: 487.33401},
    "dortmund": {x: 153.43752, y: 471.59814},
    "essen": {x: 85.471382, y: 442.1225},
    "duisburg": {x: 35.818771, y: 446.17719},
    "duesseldorf": {x: 48.684547, y: 510.40482},
    "rostock": {x: 486.93726, y: 112.73894},
    "schwerin": {x: 438.48688, y: 196.54236},
    "torgelow": {x: 636.98376, y: 189.99593},
    "berlin": {x: 586.55554, y: 327.23987},
    "frankfurto": {x: 669.04224, y: 351.39563},
    "magdeburg": {x: 467.80624, y: 359.68921},
    "halle": {x: 482.50403, y: 460.12079},
    "leipzig": {x: 524.30927, y: 489.58649},
    "dresden": {x: 636.46802, y: 532.5907},
    "erfurt": {x: 425.55627, y: 527.42883},
    "fulda": {x: 322.48627, y: 585.23718},
    "nuernberg": {x: 425.14072, y: 730.10272},
    "wuerzburg": {x: 336.1127, y: 687.77039},
    "aachen": {x: 25.151087, y: 573.60236},
    "koeln": {x: 101.39019, y: 549.40863},
    "frankfurtm": {x: 235.8344, y: 628.13318},
    "wiesbaden": {x: 187.34021, y: 651.86182},
    "trier": {x: 57.311501, y: 691.12897},
    "mannheim": {x: 229.91835, y: 745.06201},
    "saarbruecken": {x: 122.63258, y: 765.98694},
    "stuttgart": {x: 254.14336, y: 830.3667},
    "freiburg": {x: 160.42805, y: 906.62793},
    "konstanz": {x: 251.51949, y: 950.20929},
    "augsburg": {x: 383.53683, y: 853.50317},
    "muenchen": {x: 461.29449, y: 907.34778},
    "regensburg": {x: 486.61029, y: 794.83765},
    "passau": {x: 606.82043, y: 846.42596}
  },
  connections: [
    {from: "flensburg", to: "kiel", cost: 4},
    {from: "kiel", to: "hamburg", cost: 8},
    {from: "hamburg", to: "cukhaven", cost: 11},
    {from: "hamburg", to: "bremen", cost: 11},
    {from: "hamburg", to: "hannover", cost: 17},
    {from: "cukhaven", to: "bremen", cost: 8},
    {from: "bremen", to: "hannover", cost: 10},
    {from: "bremen", to: "wilhelmshaven", cost: 11},
    {from: "bremen", to: "osnabrueck", cost: 11},
    {from: "osnabrueck", to: "wilhelmshaven", cost: 14},
    {from: "hannover", to: "osnabrueck", cost: 16},
    {from: "osnabrueck", to: "muenster", cost: 7},
    {from: "muenster", to: "dortmund", cost: 2},
    {from: "muenster", to: "essen", cost: 6},
    {from: "essen", to: "duisburg", cost: 0},
    {from: "essen", to: "duesseldorf", cost: 2},
    {from: "duesseldorf", to: "koeln", cost: 4},
    {from: "duesseldorf", to: "aachen", cost: 9},
    {from: "dortmund", to: "koeln", cost: 10},
    {from: "koeln", to: "aachen", cost: 7},
    {from: "dortmund", to: "kassel", cost: 18},
    {from: "dortmund", to: "frankfurtm", cost: 20},
    {from: "hannover", to: "kassel", cost: 15},
    {from: "kassel", to: "fulda", cost: 8},
    {from: "kassel", to: "frankfurtm", cost: 13},
    {from: "fulda", to: "frankfurtm", cost: 8},
    {from: "frankfurtm", to: "wiesbaden", cost: 0},
    {from: "koeln", to: "wiesbaden", cost: 21},
    {from: "koeln", to: "trier", cost: 20},
    {from: "aachen", to: "trier", cost: 19},
    {from: "wiesbaden", to: "trier", cost: 18},
    {from: "wiesbaden", to: "mannheim", cost: 11},
    {from: "wiesbaden", to: "saarbruecken", cost: 10},
    {from: "trier", to: "saarbruecken", cost: 11},
    {from: "mannheim", to: "saarbruecken", cost: 11},
    {from: "mannheim", to: "stuttgart", cost: 6},
    {from: "saarbruecken", to: "stuttgart", cost: 17},
    {from: "stuttgart", to: "freiburg", cost: 16},
    {from: "stuttgart", to: "konstanz", cost: 16},
    {from: "freiburg", to: "konstanz", cost: 14},
    {from: "konstanz", to: "augsburg", cost: 17},
    {from: "stuttgart", to: "augsburg", cost: 15},
    {from: "wuerzburg", to: "augsburg", cost: 19},
    {from: "stuttgart", to: "wuerzburg", cost: 12},
    {from: "mannheim", to: "wuerzburg", cost: 10},
    {from: "frankfurtm", to: "wuerzburg", cost: 13},
    {from: "wuerzburg", to: "fulda", cost: 11},
    {from: "augsburg", to: "muenchen", cost: 6},
    {from: "augsburg", to: "regensburg", cost: 13},
    {from: "muenchen", to: "regensburg", cost: 10},
    {from: "muenchen", to: "passau", cost: 14},
    {from: "regensburg", to: "passau", cost: 12},
    {from: "augsburg", to: "nuernberg", cost: 18},
    {from: "regensburg", to: "nuernberg", cost: 12},
    {from: "nuernberg", to: "wuerzburg", cost: 8},
    {from: "nuernberg", to: "erfurt", cost: 21},
    {from: "erfurt", to: "fulda", cost: 13},
    {from: "erfurt", to: "kassel", cost: 15},
    {from: "erfurt", to: "hannover", cost: 19},
    {from: "erfurt", to: "dresden", cost: 19},
    {from: "erfurt", to: "halle", cost: 6},
    {from: "halle", to: "leipzig", cost: 0},
    {from: "leipzig", to: "dresden", cost: 13},
    {from: "dresden", to: "frankfurto", cost: 16},
    {from: "leipzig", to: "frankfurto", cost: 21},
    {from: "halle", to: "berlin", cost: 17},
    {from: "halle", to: "magdeburg", cost: 11},
    {from: "berlin", to: "frankfurto", cost: 6},
    {from: "magdeburg", to: "berlin", cost: 10},
    {from: "hannover", to: "magdeburg", cost: 15},
    {from: "hannover", to: "schwerin", cost: 19},
    {from: "hamburg", to: "schwerin", cost: 8},
    {from: "hamburg", to: "lubeck", cost: 6},
    {from: "lubeck", to: "schwerin", cost: 6},
    {from: "schwerin", to: "rostock", cost: 6},
    {from: "schwerin", to: "berlin", cost: 18},
    {from: "schwerin", to: "magdeburg", cost: 16},
    {from: "rostock", to: "torgelow", cost: 19},
    {from: "schwerin", to: "torgelow", cost: 19},
    {from: "torgelow", to: "berlin", cost: 15}
  ]
};

interface Connection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  cost: number;
  cx: number;
  cy: number;
  r: number;
}

@Component({
  selector: 'power-grid-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() table: Table;
  @Input() state: PowerGrid;
  @Input() selectedAction?: ActionType;

  @Output() perform = new EventEmitter<Action>();

  base: MapDescr = GERMANY;

  cities = Object.keys(this.base.cities).map(name => {
    const city = this.base.cities[name];
    return {name, x: city.x, y: city.y};
  })

  connections: Connection[] = this.base.connections.map(conn => {
    const from = this.base.cities[conn.from];
    const to = this.base.cities[conn.to];
    const width = Math.min(24, Math.max(8, Math.ceil(conn.cost / 4) * 3));
    return {
      x1: from.x, y1: from.y,
      x2: to.x, y2: to.y,
      cost: conn.cost,
      width: width,
      cx: from.x + (to.x - from.x) / 2,
      cy: from.y + (to.y - from.y) / 2,
      r: width / 2 + 4
    };
  });

  constructor() {

  }

  ngOnInit(): void {
  }

  canSelectCity(city: City): boolean {
    return this.selectedAction === ActionType.CONNECT_CITY
      && !this.state.cities[city].includes(this.table.player);
  }

  selectCity(city: City) {
    if (!this.canSelectCity(city)) {
      return;
    }

    this.perform.emit({type: ActionType.CONNECT_CITY, city});
  }
}
