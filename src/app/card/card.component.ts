import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {ActionType, Card, CattleCard, ObjectiveCard, Task} from '../model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() card: Card;

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
    return 'back';
  }

}
