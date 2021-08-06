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

import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {ActionType, Card, CattleCard, ObjectiveCard, Task} from '../model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() emptyType: 'CATTLE' | 'OBJECTIVE';
  @Input() card: Card;
  @Input() showPoints = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  get type(): 'CATTLE' | 'OBJECTIVE' {
    return this.card ? ('breedingValue' in this.card ? 'CATTLE' : 'OBJECTIVE') : null;
  }

  get cattleCard(): CattleCard {
    return this.card as CattleCard;
  }

  get objectiveCard(): ObjectiveCard {
    return this.card as ObjectiveCard;
  }

  @HostBinding('class')
  get className(): string {
    if (this.type === 'CATTLE') {
      return this.cattleCard.type;
    } else if (this.type === 'OBJECTIVE') {
      let prefix;

      switch (this.objectiveCard.action) {
        case undefined:
        case null:
          prefix = 'START';
          break;

        case ActionType.GAIN_2_DOLLARS:
        case ActionType.DRAW_CARD:
        case ActionType.SINGLE_OR_DOUBLE_AUXILIARY_ACTION:
          prefix = this.objectiveCard.action.toString();
          break;
        case ActionType.DRAW_2_CARDS: // backward compatibility
        case ActionType.DRAW_3_CARDS: // backward compatibility
          prefix = ActionType.DRAW_CARD.toString();
          break;

        case ActionType.MOVE_ENGINE_AT_MOST_2_FORWARD:
        case ActionType.MOVE_ENGINE_AT_MOST_3_FORWARD:
          prefix = 'ENGINE';
          break;

        case ActionType.MOVE_3_FORWARD_WITHOUT_FEES:
          prefix = 'MOVE';
          break;
      }
      return prefix + '_' + this.objectiveCard.tasks.map(task => {
        switch (task) {
          case Task.BREEDING_VALUE_3:
            return '3';
          case Task.BREEDING_VALUE_4:
            return '4';
          case Task.BREEDING_VALUE_5:
            return '5';
          case Task.BUILDING:
            return 'B';
          case Task.HAZARD:
            return 'H';
          case Task.STATION:
            return 'S';
          case Task.GREEN_TEEPEE:
            return 'GREEN';
          case Task.BLUE_TEEPEE:
            return 'BLUE';
          default:
            return task.toString();
        }
      })
        .join('_');
    }
    return this.emptyType === 'CATTLE' ? 'back' : 'back_grey';
  }

}
