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

import {Injectable} from '@angular/core';
import {Option} from "../shared/api";
import {TranslateService} from "@ngx-translate/core";
import {PlayerType, Table} from "../shared/model";
import {Buildings, Difficulty, Mode, PlayerOrder, Variant} from "./model";
import {GwtProvider} from "./gwt.provider";

@Injectable({
  providedIn: 'root'
})
export class Gwt2Provider extends GwtProvider {

  getOptions(table: Table): Option[] {
    const options: Option[] = [
      {key: 'mode', values: [Mode.ORIGINAL, Mode.STRATEGIC], defaultValue: Mode.ORIGINAL},
      {key: 'buildings', values: [Buildings.BEGINNER, Buildings.RANDOMIZED], defaultValue: Buildings.RANDOMIZED},
      {key: 'playerOrder', values: [PlayerOrder.RANDOMIZED, PlayerOrder.BIDDING], defaultValue: PlayerOrder.RANDOMIZED},
      {key: 'variant', values: [Variant.ORIGINAL, Variant.BALANCED], defaultValue: Variant.ORIGINAL},
      {key: 'railsToTheNorth', values: [false, true], defaultValue: false}
    ];

    if (table.otherPlayers.some(playerId => table.players[playerId].type === PlayerType.COMPUTER)) {
      options.push({
        key: 'difficulty',
        values: [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD, Difficulty.VERY_HARD],
        defaultValue: Difficulty.EASY
      });
    }

    return options;
  }

  constructor(translateService: TranslateService) {
    super(translateService);
  }

}
